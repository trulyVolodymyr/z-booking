import frLocale from 'element-plus/es/locale/lang/fr'
import { generalTranslations as general } from './general.translation'
import { validationTranslations as validation } from './validation.translation'

export const fr = {
  [frLocale.name]: {
    el: frLocale.el,

    general,
    validation
  }
}
