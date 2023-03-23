import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Setting from  './views/setting/index'
import './App.css'

function App(props) {
  return (
    <BrowserRouter>
      <Routes className="App">
        <Route path="/" element={<Setting {...props}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
