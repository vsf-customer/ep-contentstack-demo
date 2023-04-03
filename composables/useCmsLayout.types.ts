import { ComputedRef } from '@nuxtjs/composition-api'

export interface UseCmsLayout {
  getLayout: () => Promise<any>
  header: ComputedRef<Header>
  footer: ComputedRef<Footer>
  styleGuide: ComputedRef<Component[]>
}

export interface Component {
  componentName: string
  props: any
}

export interface NavigationItem {
  caption: string
  link: string
}

export interface Header {
  logo: {
    url: string
    alt: string
  }
  navigation: NavigationItem[]
}

export interface FooterColumn {
  heading: string
  items: NavigationItem[]
}

export interface Footer {
  items: FooterColumn
}
