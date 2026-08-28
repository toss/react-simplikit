import type { LocaleThemeStrings } from '../locales.mts';

export const es: LocaleThemeStrings = {
  homeNavLabel: 'Inicio',
  guideLabel: 'Guía',
  referenceLabel: 'Referencia',
  componentsLabel: 'Componentes',
  hooksLabel: 'Hooks',
  utilsLabel: 'Utilidades',
  mobileWebLabel: 'Web móvil',
  guidePages: {
    core: {
      intro: 'Introducción',
      whyReactSimplikitMatters: 'Por qué importa react-simplikit',
      installation: 'Instalación',
      aiIntegration: 'Integración con IA',
      designPrinciples: 'Principios de diseño',
      contributing: 'Contribuir',
    },
    mobile: {
      intro: 'Introducción',
      roadmap: 'Hoja de ruta',
      installation: 'Instalación',
      designPrinciples: 'Principios de diseño',
      contributing: 'Contribuir',
    },
  },
  editLinkText: 'Editar esta página en GitHub',
  footerMessage: 'Publicado bajo la licencia MIT.',
  search: {
    translations: {
      button: {
        buttonText: 'Buscar',
        buttonAriaLabel: 'Buscar',
      },
      modal: {
        backButtonTitle: 'Cerrar la búsqueda',
        displayDetails: 'Mostrar la lista detallada',
        // The footer strings render after a <kbd> glyph, and noResultsText renders before the
        // quoted query, so both are sentence fragments rather than standalone labels.
        footer: {
          closeKeyAriaLabel: 'escape',
          closeText: 'para cerrar',
          navigateDownKeyAriaLabel: 'flecha abajo',
          navigateText: 'para navegar',
          navigateUpKeyAriaLabel: 'flecha arriba',
          selectKeyAriaLabel: 'enter',
          selectText: 'para seleccionar',
        },
        noResultsText: 'No hay resultados para',
        resetButtonTitle: 'Restablecer la búsqueda',
      },
    },
  },
};
