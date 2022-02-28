import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Dropdown from 'react-dropdown';

function App() {
  const [images, setImages] = useState([]);
  const [hue, setHue] = useState(120);
  const [contrast, setContrast] = useState(30000);
  const [selectedImage, setSelectedImage] = useState(null)
  const [img, setImg] = useState(null)

  const onChangeHue = (event) => {
    setHue(event.target.value)
  }

  const onChangeContrast = (event) => {
    setContrast(event.target.value)
  }

  const fetchImage = useCallback(async () => {
    const image =  await fetch(`https://d2zafgcvpe5fbs.cloudfront.net/${selectedImage.value}/full/512,/0/default.jpg?white_point=${contrast}&colorize=hue:${hue}`)
    const imageBlob = await image.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  }, [selectedImage, contrast, hue])

  const options  = images.map(i=> ({value: i.link, label: i.name}))
  
  const onChangeDropdown = (option) => {
    setSelectedImage(option)
  }
  const defaultOption = options[0];

  useEffect(()=> {
    if (!selectedImage || !hue || !contrast) {
      return;
    }
    fetchImage()
  }, [selectedImage, contrast, hue, fetchImage])

  useEffect(()=> {
    const getImages = async() => {
      const response = await fetch('https://s3.us-west-2.amazonaws.com/external-share.system1bio/littleviewer/littleviewer_images.json')
      
      setImages((await response.json()).images)
    }

    getImages()
  }, [])

  return (
    <div className="App">
      <header className="App-header">Hello World!</header>
      <div className="stack">
      <div className="inputStack">
        <label htmlFor="imageSelection" >Select an image</label>
        <Dropdown className="dropdown" id="imageSelection" options={options} value={selectedImage ?? defaultOption} placeholder="Select an image" onChange={onChangeDropdown}/>
      </div>
      <div className="inputStack">
        <label htmlFor="hue" >Hue</label>
        <input id="hue" name="hue" value={hue} type="number"min={0} max={255} onChange={onChangeHue}/>
      </div>
      <div className="inputStack">
        <label htmlFor="contrast">Contrast</label>
        <input id="contrast" name="contrast" value={contrast}type="number" min={0} max={65535} onChange={onChangeContrast}/>
      </div>
      </div>
      <img  src={img} alt=""/>
    </div>
  );
}

export default App;

// Future TODOs
// - set up typescript 
// - style dropdown 
// - generalize input into a component with title and styles


