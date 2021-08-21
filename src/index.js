import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Container, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel, Switch, Paper, TextField, InputAdornment, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import { format } from 'date-format-parse';

import useWindowSize from './hooks/useWindowSize';

const App = () => {

  const [data, setData] = useState();
  const [showInstructions, setShowInstructions] = useState(false);
  const [sortMethod, setSortMethod] = useState(0);
  const [newLocations, setNewLocations] = useState([]);
  const [filter, setFilter] = useState('');
  const windowSize = useWindowSize();

  // On page load
  useEffect(() => {
    // Get cookies
    let previouslySeen = [];
    for (const cookie of document.cookie.split('; ')) {
      if (cookie.split('=')[0] === new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()) {
        previouslySeen = cookie.split('=')[1].split('|');
      }

      if (cookie.split('=')[0] === 'sort') setSortMethod(Number.parseInt(cookie.split('=')[1]));

      if (cookie.split('=')[0] === 'show') setShowInstructions(cookie.split('=')[1] === 'true');
    }

    fetch('https://placesofinterest.azurewebsites.net/')
      .then(res => res.json())
      .then(res => {
        res.sort((a,b) => new Date(b.date) - new Date(a.date))
        setData(res);


        // Get the locations for the current day
        let currentDay = [];
        for (const row of res) if (new Date(row.added).getDate() === new Date().getDate()) currentDay.push(row.name)
        document.cookie = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + '=' + currentDay.join('|');

        let newLocs = [];
        for (const loc of currentDay) if (!previouslySeen.includes(loc)) newLocs.push(loc);
        setNewLocations(newLocs);
      })

      
  }, []);

  const handleShowButton = () => {
    setShowInstructions(!showInstructions);
    document.cookie = 'show=' + !showInstructions;
  }

  const handleSetSort = (event) => {
    setSortMethod(event.target.value);
    document.cookie = 'sort=' + event.target.value;
  }

  const getDateFormat = (date) => {
    date = new Date(date);
    return (
      format(date, 'dddd D') + (format(date, 'D') === '1' ? 'st' : format(date, 'D') === '2' ? 'nd' :
        format(date, 'D') === '21' ? 'st' : format(date, 'D') === '22' ? 'nd' :
          format(date, 'D') === '31' ? 'st' : 'th') + format(date, ' MMMM')
    )
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
                  onChange={handleSetSort}
                >
                  <MenuItem value={0}>Date Added</MenuItem>
                  <MenuItem value={1}>Date at Location</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Switch checked={showInstructions} onChange={handleShowButton} />}
                label="Show Ministry of Health Instructions"
              />
            </Grid>
            <Grid item >
              <Button variant='outlined' onClick={() => setNewLocations([])}>Mark New as Seen</Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper style={{ height: windowSize.height - 130, overflowY: 'scroll', marginTop: 20 }}>
          {data !== undefined ? (
            <Table stickyHeader>
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date Added</TableCell>
                  {showInstructions ? <TableCell>Instructions</TableCell> : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.filter(row =>
                  row.name.toLowerCase().includes(filter) ||
                  row.address.toLowerCase().includes(filter) ||
                  row.time.replaceAll('.', ':').replaceAll(' ', '').replaceAll('-', ' - ').toLowerCase().includes(filter)
                )
                .sort((a, b) => sortMethod === 0 ? new Date(b.added) - new Date(a.added) : new Date(b.date) - new Date(a.date))
                .map(row => (
                  <TableRow style={{ backgroundColor: newLocations.includes(row.name) ? '#ffeeee' : '#ffffff' }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{getDateFormat(row.date)}</TableCell>
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
          ) : <CircularProgress style={{ position: 'fixed', top: '45%', left: '48%' }} />}
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

