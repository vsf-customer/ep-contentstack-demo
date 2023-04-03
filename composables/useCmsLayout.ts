import { useContent, extractImage } from "@vsf-enterprise/contentstack";
import { computed } from "@nuxtjs/composition-api";

const useCmsLayout = () => {
  const { search: searchStyleGuide, content: styleGuide } =
    useContent("style-guide");
  const { search: searchLayout, content: layout } = useContent("layout");

  const getLayout = () =>
    Promise.all([
      searchStyleGuide({
        custom: {
          type: 'styleGuide',
          field: 'title',
          value: 'Page Style Guide',
        },
      }),

      searchLayout({
        custom: {
          type: "layout",
          field: "title",
          value: "cms-layout",
        },
      }),
    ]);

  const header = computed(() => {
    const extractedHeader =
      layout.value.length && layout.value[0].layout.header;

    return {
      logo: extractedHeader
        ? extractImage(extractedHeader.logo)
        : { url: null, alt: null },
      navigation: extractedHeader ? extractedHeader.navigation : [],
    };
  });

  const footer = computed(() => {
    const extractedFooter =
      layout.value.length && layout.value[0].layout.footer;
    return {
      items: extractedFooter ? extractedFooter.items : [],
    };
  });

  return {
    getLayout,
    styleGuide,
    header,
    footer,
  };
};

export default useCmsLayout;
