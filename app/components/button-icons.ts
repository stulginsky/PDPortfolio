import arrowNavLeft from '../assets/icons/arrow-nav-left.svg'
import arrowNavRight from '../assets/icons/arrow-nav-right.svg'
import arrowNavUp from '../assets/icons/arrow-nav-up.svg'
import chevronDown from '../assets/icons/chevron-down.svg'
import chevronUp from '../assets/icons/chevron-up.svg'
import cross from '../assets/icons/cross.svg'
import download from '../assets/icons/download.svg'
import externalLink from '../assets/icons/external-link.svg'
import favicon from '../assets/icons/favicon.svg'
import figma from '../assets/icons/figma.svg'
import gitHub from '../assets/icons/git-hub.svg'
import magnifyingGlass from '../assets/icons/magnifying-glass.svg'
import moon from '../assets/icons/moon.svg'
import print from '../assets/icons/print.svg'
import sun from '../assets/icons/sun.svg'

/** Canonical Foundation SVGs accepted by Figma Instance Swap on button controls. */
export const buttonIconSources = {
  Download: download,
  Print: print,
  ArrowNavLeft: arrowNavLeft,
  ArrowNavRight: arrowNavRight,
  ArrowNavUp: arrowNavUp,
  Cross: cross,
  MagnifyingGlass: magnifyingGlass,
  Sun: sun,
  Moon: moon,
  GitHub: gitHub,
  Figma: figma,
  ExternalLink: externalLink,
  Favicon: favicon,
  ChevronDown: chevronDown,
  ChevronUp: chevronUp,
} as const

export type ButtonIconName = keyof typeof buttonIconSources

export const getButtonIconSource = (icon: ButtonIconName) => buttonIconSources[icon]
