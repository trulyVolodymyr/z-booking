import itLocale from 'element-plus/es/locale/lang/it'
import { generalTranslations as general } from './general.translation'
import { validationTranslations as validation } from './validation.translation'

export const it = {
  [itLocale.name]: {
    el: itLocale.el,

    general,
    validation
  }
}
