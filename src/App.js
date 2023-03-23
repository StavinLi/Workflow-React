import { HashRouter, Routes, Route} from 'react-router-dom'
import Setting from  './views/setting/index'
import './App.css'

function App(props) {
  return (
    <HashRouter>
      <Routes className="App">
        <Route path="/" element={<Setting {...props}/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
