import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeContext'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark', 'light')
  })

  it('defaults to dark theme', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('toggles to light on click', async () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('toggles back to dark on second click', async () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('persists theme to localStorage', async () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    await userEvent.click(screen.getByRole('button'))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('applies class to document.documentElement', async () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await userEvent.click(screen.getByRole('button'))
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })
})
