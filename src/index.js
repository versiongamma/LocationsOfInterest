import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Container, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { format } from 'date-format-parse';

const App = () => {

  const [data, setData] = useState();

  useEffect(() => {
    fetch('https://placesofinterest.azurewebsites.net/')
      .then(res => res.json())
      .then(res => {
        res.sort((a, b) => new Date(b.added) - new Date(a.added));
        setData(res);
      });
  }, []);

  return (
    <Container maxWidth='xl'>
      {data !== undefined ? (
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell component='th'>Name</TableCell>
            <TableCell component='th'>Address</TableCell>
            <TableCell component='th'>Date</TableCell>
            <TableCell component='th'>Time</TableCell>
            <TableCell component='th'>Date Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>
                {
                  format(new Date(row.date), 'dddd D') + 
                  (format(new Date(row.date), 'D') === '1' ? 'st' : 
                  format(new Date(row.date), 'D') === '2' ? 'nd' :
                  format(new Date(row.date), 'D') === '21' ? 'st' :
                  format(new Date(row.date), 'D') === '22' ? 'nd' :
                  format(new Date(row.date), 'D') === '31' ? 'st' : 'th')
                }
              </TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>
                {
                  format(new Date(row.added), 'D') + 
                  (format(new Date(row.added), 'D') === '1' ? 'st' : 
                  format(new Date(row.added), 'D') === '2' ? 'nd' :
                  format(new Date(row.added), 'D') === '21' ? 'st' :
                  format(new Date(row.added), 'D') === '22' ? 'nd' :
                  format(new Date(row.added), 'D') === '31' ? 'st' : 'th') + format(new Date(row.added), ' MMMM')
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      ) : null }
    </Container>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

