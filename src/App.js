import React, {useState} from "react";
import './App.css';
import Spinner from './common/Spinner';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/EditLocation';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tableItems, settableItems] = useState("");
  const [alert, setAlert] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const locations = [];

  const search = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`/api/v1/locations/closest_by_lat_lon?${'lat='+latitude + '&lon=' + longitude}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "pinballmap.com",
            "content-type": "application/json",
            "accept": "application/json",
        }
        })
        .then(response => response.json())
        .then(response => {
          setLoading(false);
          if(response.errors) setAlert(true);
          else {
            setAlert(false);
            locations.push(response.location);
            locations.map((location) => settableItems(
              <TableBody>
              <TableCell align="center">{location.street}</TableCell>
              <TableCell align="center">{location.city}</TableCell>
              <TableCell align="center">{location.country}</TableCell>
              </TableBody>
            ));
          }
        })
        .catch(err => { console.log(err) });
  }

  const nearMe = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(setPosition);
    function setPosition(position){
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude)
    }
  }

  let tableContent;

  if(isLoading) tableContent = (
    <TableBody>
      <TableCell align="center"></TableCell>
      <TableCell align="center"><Spinner/></TableCell>
      <TableCell align="center"></TableCell>
    </TableBody>
  );
  else if (alert) tableContent = (
    <TableBody>
      <TableCell align="center"></TableCell>
      <TableCell align="center"><Alert severity="error">No locations within 50 miles.</Alert></TableCell>
      <TableCell align="center"></TableCell>
    </TableBody>
  );
  else tableContent = tableItems;

  return (
    <div className="container">
      <div className="row">
        <h1 className="title">Pinball Locations Near Me</h1>
        <form className="form-wrap">
          <TextField id="outlined-basic" style={{marginLeft: "10px"}} label="Latitude" variant="outlined" value={latitude} onChange={(e) => setLatitude((e.target.value))} margin="normal" />
          <TextField id="outlined-basic" style={{marginLeft: "10px"}} label="Longitude" variant="outlined" value={longitude} onChange={(e) => setLongitude((e.target.value))} margin="normal" />
          <Button variant="outlined" style={{margin: "25px 10px"}} startIcon={<EditIcon />} onClick={(e) => nearMe(e)}>
            Near Me
          </Button>
          <Button variant="contained" style={{margin: "25px 10px"}} endIcon={<SearchIcon />} onClick={(e) => search(e)}>
            Search
          </Button>
        </form>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Street</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="center">Country</TableCell>
              </TableRow>
            </TableHead>
            {tableContent}
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;
