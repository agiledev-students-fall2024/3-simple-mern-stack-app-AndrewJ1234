import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
// import './Message.css'

/**
 * A React component that represents one Message in the list of messages.
 * @param {*} param0 an object holding any props and a few function definitions passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const AboutMe = () => {
 
    const [paragraphs, setParagraphs] = useState([]);
    const [imageLink, setImageLink] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5002/aboutme`).then(response => {
          // console.log(5,response) debugging
            const data = response.data
            setImageLink(data.image)
            setParagraphs(data.paragraphs)
        })
        .catch(error => {
            console.log("There was an error fetching the data", error);
        })
    }, [])
    
  return (
    <>
      <article className="AboutMe-Article">
        <h1>About Me</h1>
        <img src={imageLink} alt="About Me Image"/>
        {paragraphs.map((paragraph, index) => {
          return <p key= {index}>{paragraph}</p>
        })}
            
      </article>
    </>
  )
}

// make this component available to be imported into any other file
export default AboutMe
