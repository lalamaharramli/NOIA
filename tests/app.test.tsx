import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../src/App'

/**
 * End-to-end-ish tests in jsdom: real router, real translations, real form
 * logic. They cover the flows a visitor actually uses without needing a
 * running server or a backend.
 */

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  document.querySelectorAll('[data-managed]').forEach((element) => element.remove())
})

describe('language routing', () => {
  it('serves Azerbaijani at / and switches to the English page', async () => {
    const user = userEvent.setup()
    renderAt('/')

    expect(
      await screen.findByRole('heading', { level: 1, name: /sadə iplikdən/i }),
    ).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('az')

    const englishLink = screen.getByRole('link', { name: 'English (EN)' })
    expect(englishLink).toHaveAttribute('href', '/en')
    await user.click(englishLink)

    expect(
      await screen.findByRole('heading', { level: 1, name: /from simple yarn/i }),
    ).toBeInTheDocument()
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
    expect(screen.getByRole('link', { name: 'Azərbaycanca (AZ)' })).toHaveAttribute('href', '/')
    expect(document.title).toContain('Handmade crochet')

    const alternateLocales = [
      ...document.querySelectorAll('meta[property="og:locale:alternate"]'),
    ].map((element) => element.getAttribute('content'))
    expect(alternateLocales).toEqual(['az_AZ', 'ru_RU'])
  })

  it('keeps the product when changing language', async () => {
    const user = userEvent.setup()
    renderAt('/en/product/square-motif-tote')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Square Motif Tote' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Русский (RU)' }))

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Сумка из квадратных мотивов',
      }),
    ).toBeInTheDocument()
    await waitFor(() => expect(document.documentElement.lang).toBe('ru'))
  })

  it('shows the 404 page in the language of the URL and marks it noindex', async () => {
    renderAt('/en/typo')

    expect(
      await screen.findByRole('heading', { level: 1, name: /this page was not found/i }),
    ).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')

    const robots = document.querySelector<HTMLMetaElement>('meta[data-managed="robots"]')
    expect(robots?.content).toBe('noindex, nofollow')
  })
})

describe('shop', () => {
  it('searches and filters, writing the state into the URL', async () => {
    const user = userEvent.setup()
    renderAt('/en/shop')

    expect(
      await screen.findByRole('heading', { level: 1, name: /pieces made by hand/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Results: 8')).toBeInTheDocument()

    const search = screen.getByLabelText('Search products')
    await user.type(search, 'blanket')

    await waitFor(() => expect(screen.getByText('Results: 1')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /view ripple baby blanket/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /view square motif tote/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(screen.getByText('Results: 8')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Gifts' }))
    const giftCards = screen.getAllByRole('link', { name: /view /i })
    expect(giftCards.length).toBeGreaterThan(0)
    expect(screen.getByText(/Results: \d/)).toBeInTheDocument()
  })

  it('shows an empty state and can reset filters', async () => {
    const user = userEvent.setup()
    renderAt('/en/shop')

    await screen.findByRole('heading', { level: 1, name: /pieces made by hand/i })
    await user.type(screen.getByLabelText('Search products'), 'zzzzz')

    expect(await screen.findByText('Nothing found')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))

    await waitFor(() => expect(screen.getByText('Results: 8')).toBeInTheDocument())
    expect(screen.getByLabelText('Search products')).toHaveValue('')
  })
})

describe('product page', () => {
  it('updates the prepared message when an option changes', async () => {
    const user = userEvent.setup()
    renderAt('/en/product/square-motif-tote')

    await screen.findByRole('heading', { level: 1, name: 'Square Motif Tote' })

    const blush = screen.getByRole('radio', { name: 'Soft blush' })
    await user.click(blush)
    expect(blush).toBeChecked()

    await user.click(screen.getByText('Message preview'))
    expect(screen.getByText(/Colour: Soft blush/i)).toBeInTheDocument()
    expect(screen.getByText(/Square Motif Tote/i, { selector: 'pre' })).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /customise this design/i })).toHaveAttribute(
      'href',
      '/en/custom-order?product=square-motif-tote',
    )
  })
})

describe('custom order form', () => {
  it('validates, focuses the first error and prepares a message without a network request', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    renderAt('/en/custom-order')
    await screen.findByRole('heading', { level: 1, name: /plan the piece you want/i })

    await user.click(screen.getByRole('button', { name: 'Prepare enquiry' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please check the highlighted fields.',
    )
    const nameInput = screen.getByLabelText(/^Name/)
    expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    expect(nameInput).toHaveFocus()

    await user.type(nameInput, 'Aysel')
    await user.selectOptions(screen.getByLabelText(/^Type of piece/), 'bag')
    await user.type(screen.getByLabelText(/^WhatsApp number/), '+994 50 123 45 67')
    await user.type(screen.getByLabelText(/^Preferred colours/), 'cream')
    await user.type(screen.getByLabelText(/^Description/), 'A roomy bag in cream cotton, please.')

    await user.click(screen.getByRole('button', { name: 'Prepare enquiry' }))

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Your message is ready' }),
    ).toBeInTheDocument()

    await user.click(screen.getByText('Message preview'))
    expect(screen.getByText(/Name: Aysel/)).toBeInTheDocument()
    expect(screen.getByText(/Type of piece: Bag/)).toBeInTheDocument()
    expect(screen.getByText(/Contact \(WhatsApp\): \+994 50 123 45 67/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy the enquiry' })).toBeInTheDocument()

    // The message is only prepared locally; nothing is posted to a server.
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('switches to e-mail validation when e-mail is chosen', async () => {
    const user = userEvent.setup()
    renderAt('/en/custom-order')
    await screen.findByRole('heading', { level: 1, name: /plan the piece you want/i })

    await user.click(screen.getByRole('radio', { name: 'E-mail' }))
    await user.type(screen.getByLabelText(/^Name/), 'Aysel')
    await user.selectOptions(screen.getByLabelText(/^Type of piece/), 'bag')
    await user.type(screen.getByLabelText(/^E-mail address/), 'not-an-email')
    await user.type(screen.getByLabelText(/^Description/), 'A roomy bag in cream cotton, please.')
    await user.click(screen.getByRole('button', { name: 'Prepare enquiry' }))

    expect(await screen.findByText(/enter a valid e-mail address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^E-mail address/)).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('mobile navigation', () => {
  it('opens and closes with the menu button and Escape', async () => {
    const user = userEvent.setup()
    renderAt('/en/shop')

    await screen.findByRole('heading', { level: 1, name: /pieces made by hand/i })

    const menuButton = screen.getByRole('button', { name: 'Open menu' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    const panel = document.getElementById('mobile-menu')!
    expect(panel.hidden).toBe(false)
    expect(within(panel).getByRole('link', { name: 'Collection' })).toHaveAttribute(
      'href',
      '/en/shop',
    )

    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()
  })
})
