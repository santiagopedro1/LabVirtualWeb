import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/pt-br'

import AirDatepicker from 'air-datepicker'

dayjs.extend(localeData)
dayjs.locale('pt-br')

const locale: any = {
  days: dayjs.localeData().weekdays(),
  daysMin: dayjs.localeData().weekdaysShort(),
  months: [
    ...dayjs
      .localeData()
      .months()
      .map((month: string) => month[0].toUpperCase() + month.slice(1))
  ],
  monthsShort: [
    ...dayjs
      .localeData()
      .monthsShort()
      .map((month: string) => month[0].toUpperCase() + month.slice(1))
  ],
  dateFormat: 'dd/MM/yyyy',
  firstDay: 0
}

function mountDatepicker(handleSelect: Function, selectedDate: Date) {
  const isMobile = window.innerWidth < 768
  const selectedDates = selectedDate ? [selectedDate] : selectedDate
  new AirDatepicker('#datepicker', {
    locale: locale,
    selectedDates: selectedDates,
    maxDate: new Date(),
    onSelect: ({ date }) => handleSelect(date as Date),
    toggleSelected: false,
    autoClose: true,
    isMobile: isMobile
  })
}

export default mountDatepicker
