import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Container, Table, TableBody, TableCell, TableHead, TableRow, Paper, TextField, InputAdornment, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'

import useWindowSize from './hooks/useWindowSize';
import Row from './components/Row';

const App = () => {

  const [data, setData] = useState();
  const [sortMethod, setSortMethod] = useState(0);
  const [newLocations, setNewLocations] = useState([]);
  const [region, setRegion] = useState('All');
  const [filter, setFilter] = useState('');
  const windowSize = useWindowSize();

  // On page load
  useEffect(() => {
    // Get cookies
    let previouslySeen = [];
    for (const cookie of document.cookie.split('; ')) {
      if (cookie.split('=')[0].slice(0, -1) === new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear()) {
        previouslySeen = [...previouslySeen, ...cookie.split('=')[1].split('|')]
      }

      if (cookie.split('=')[0] === 'region') setRegion(cookie.split('=')[1])
      if (cookie.split('=')[0] === 'sort') setSortMethod(Number.parseInt(cookie.split('=')[1]));
      
    }

    fetch('https://locationsofinterest.herokuapp.com/')
      .then(res => res.json())
      .then(res => {
        setData(res);

        console.log(res);

        // Get the locations for the current day
        let currentDay = [];
        for (const row of res) {
          if (new Date(row.added).getDate() === new Date().getDate()) currentDay.push(row.name)
        }

        for (let [i, chunk] of (currentDay.join('|').match(/(.|[\r\n]){1,4000}/g)).entries()) {
          document.cookie = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + i + '=' + chunk;
        }
        

        let newLocs = [];
        for (const loc of currentDay) if (!previouslySeen.includes(loc)) newLocs.push(loc);
        setNewLocations(newLocs);
      })

      
  }, []);

  const handleSetSort = (event) => {
    setSortMethod(event.target.value);
    document.cookie = 'sort=' + event.target.value;
  }

  const handleSetRegion = (event) => {
    setRegion(event.target.value);
    document.cookie = 'region=' + event.target.value;
  }

  const getTimeFormat = (time) => {
    return time.replaceAll('.', ':').replaceAll(' ', '').replaceAll('-', ' - ')
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
              <FormControl>
                <InputLabel>Region</InputLabel>
                <Select
                  value={region}
                  onChange={handleSetRegion}
                >
                  <MenuItem value={'All'}>All</MenuItem>
                  <MenuItem value={'Auckland'}>Auckland</MenuItem>
                  <MenuItem value={'Wellington'}>Wellington</MenuItem>
                  <MenuItem value={'Coromandel'}>Coromandel</MenuItem>
                </Select>
              </FormControl>
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
                <col style={{ width: '1%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date Added</TableCell>
                  <TableCell>Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...data].filter(row => 
                  (row.name.toLowerCase().includes(region !== 'All' ? region.toLowerCase() : '') ||
                  row.address.toLowerCase().includes(region !== 'All' ? region.toLowerCase() : '')) && (
                  row.name.toLowerCase().includes(filter) ||
                  row.address.toLowerCase().includes(filter) ||
                  getTimeFormat(row.time).toLowerCase().includes(filter))
                )
                .sort((a, b) => sortMethod === 0 ? new Date(b.added) - new Date(a.added) : new Date(b.date) - new Date(a.date))
                .map(row => (<Row {...row} newLocations={newLocations}/>))}
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
