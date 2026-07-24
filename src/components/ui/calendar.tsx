import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import classNames from 'classnames'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames: dayPickerClassNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        months: 'flex flex-col sm:flex-row w-full',
        month: 'flex flex-col w-full gap-yhalf',
        caption: 'flex justify-center relative items-center w-full',
        caption_label: 'w-full font-sans text-base',
        nav: 'flex justify-end items-center gap-2 w-full',
        nav_button: classNames('h-8 w-8 p-0'),
        nav_button_previous: 'relative font-serif text-md',
        nav_button_next: 'relative font-serif text-md',
        table: 'flex flex-col w-full border-collapse gap-yhalf',
        head_row: 'flex justify-between gap-xhalf text-center w-full',
        head_cell: 'w-full font-normal font-sans',
        row: 'flex gap-xhalf w-full mb-yhalf font-serif',
        cell: 'relative w-full p-0 text-center text-md focus-within:relative focus-within:z-20',
        day: 'h-[39.6px] w-[39.6px] p-0 aria-selected:opacity-100 border border-transparent',
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected: 'w-full',
        day_today: '',
        day_outside: '',
        day_disabled: '',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...dayPickerClassNames,
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
