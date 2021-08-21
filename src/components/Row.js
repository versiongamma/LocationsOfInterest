import { TableCell, TableRow, IconButton, Collapse, Box, Typography} from '@material-ui/core';
import { useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { format } from 'date-format-parse';

const getDateFormat = (date) => {
  date = new Date(date);
  return (
    format(date, 'dddd D') + (format(date, 'D') === '1' ? 'st' : format(date, 'D') === '2' ? 'nd' :
      format(date, 'D') === '21' ? 'st' : format(date, 'D') === '22' ? 'nd' :
        format(date, 'D') === '31' ? 'st' : 'th') + format(date, ' MMMM')
  )
}

const getTimeFormat = (time) => {
  return time.replaceAll('.', ':').replaceAll(' ', '').replaceAll('-', ' - ')
}


const Row = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow style={{ backgroundColor: props.newLocations.includes(props.name) ? '#ffeeee' : '#ffffff' }}>

        <TableCell>{props.name}</TableCell>
        <TableCell>{props.address}</TableCell>
        <TableCell>{props.location}</TableCell>
        <TableCell>{getDateFormat(props.date)}</TableCell>
        <TableCell>{getTimeFormat(props.time)}</TableCell>
        <TableCell>{getDateFormat(props.added)}</TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#f9f9f9' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Typography style={{paddingTop: 10, paddingBottom: 10, fontSize: '0.875rem'}}>{props.instructions}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default Row;