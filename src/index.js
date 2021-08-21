import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Container, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel, Switch, Paper, TextField, InputAdornment, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import { format } from 'date-format-parse';

import useWindowSize from './hooks/useWindowSize';

const App = () => {

  const [data, setData] = useState();
  const [showInstructions, setShowInstructions] = useState(false);
  const [sortMethod, setSortMethod] = useState(0);
  const [filter, setFilter] = useState('');
  const windowSize = useWindowSize();

  useEffect(() => {
    fetch('https://placesofinterest.azurewebsites.net/')
      .then(res => res.json())
      .then(res => {
        res.sort((a, b) => new Date(b.added) - new Date(a.added));
        setData(res);
      });
  }, []);

  const handleSortChange = (event) => {
    setSortMethod(event.target.value);
    if (event.target.value === 0) setData(data.sort((a, b) => new Date(b.added) - new Date(a.added)));
    if (event.target.value === 1) setData(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }

  return (
    <>
      <Container maxWidth='xl'>
        <Paper style={{ padding: 20 }}>
          <Grid container alignItems='center' spacing={5}>
            <Grid item>
              <TextField
                label='Search'
                InputProps={{ endAdornment: <InputAdornment position='end'><SearchIcon /></InputAdornment> }}
                onChange={(event) => setFilter(event.target.value.toLowerCase())}
              />
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel>Sort Method</InputLabel>
                <Select

                  value={sortMethod}
                  onChange={handleSortChange}
                >
                  <MenuItem value={0}>Date Added</MenuItem>
                  <MenuItem value={1}>Date at Location</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Switch checked={showInstructions} onChange={() => setShowInstructions(!showInstructions)} />}
                label="Show What to Do"
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper style={{ height: windowSize.height - 130, overflowY: 'scroll', marginTop: 20 }}>
          {data !== undefined ? (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date Added</TableCell>
                  {showInstructions ? <TableCell>What to Do</TableCell> : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.filter(row => 
                  row.name.toLowerCase().includes(filter) || 
                  row.address.toLowerCase().includes(filter) || 
                  row.time.toLowerCase().includes(filter)
                  ).map(row => (
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
                    <TableCell>{row.time.replaceAll('.', ':').replaceAll(' ', '').replaceAll('-', ' - ')}</TableCell>
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
                    {showInstructions ? <TableCell>{row.instructions}</TableCell> : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <CircularProgress style={{position: 'fixed', top: '45%', left: '48%'}}/>}
        </Paper>
      </Container>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

