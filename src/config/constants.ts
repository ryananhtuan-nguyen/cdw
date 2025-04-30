import { routes } from './routes'

export const imageSources = {
  classifiedPlaceholder:
    'https://car-dealer-website.s3.eu-west-1.amazonaws.com/next-s3-uploads/stock/classified-placeholder.jpeg',
}

export const navLinks = [
  { id: 'navlink1', href: routes.home, label: 'Home' },
  { id: 'navlink2', href: routes.inventory, label: 'Inventory' },
]

export const CARS_PER_PAGE = 3
