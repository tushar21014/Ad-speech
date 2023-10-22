import React, { useState } from 'react';
import "../Components/Main.css"
import { useSpeechSynthesis } from "react-speech-kit";
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
    const { speak, voices } = useSpeechSynthesis();
    const [isLoading, setIsLoading] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [adText, setAdText] = useState('');
    // const [audioURL, setAudioURL] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [price, setprice] = useState('')
    const [errors, setErrors] = useState('')
    // const [voiceIndex, setVoiceIndex] = useState(null);
    const voice = voices[0] || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setAdText("");
            setImageURL("");
            setprice("");
            setErrors("")
            setIsLoading(true)

            const response = await fetch(`http://localhost:3004/scrape-and-speak?keyword=${keyword}`);
            const data = await response.json();
            if(data.error){
               setErrors(data.error)
               setIsLoading(false)
               return
            }
            setAdText(data.adText);
            // setAudioURL(data.audioURL);
            setImageURL(data.imageURL);
            setprice(data.adPrice);
            setIsLoading(false)

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            <div>
                <div className='grandfather-cont'>
                    <div className='father-cont' style={{ minWidth: "20%", transition: "all 500ms linear" }}>
                        <div className='h3 text-center my-4'>Product search</div>
                        <form onSubmit={handleSubmit}>
                            <div className='d-flex form-cont'>
                                <div className='text-left my-1' style={{ width: "90%" }}>Write Product Name</div>
                                <label style={{ width: "90%" }}>
                                    <input class="form-control mr-sm-2" style={{ width: '100%' }} required type="search" onChange={(e) => setKeyword(e.target.value)} placeholder="Search" aria-label="Search" value={keyword} />

                                </label>
                                <button type="submit" style={{ width: "90%", marginTop: "5%" }} className='btn btn-primary'>Search</button>
                            </div>
                        </form>
                        <div className='second-cont d-flex row' style={{ width: "70%", padding: '15px' }}>

                            {isLoading && (

                                <div className='loaderDiv'>
                                    <span className="loader"></span>
                                </div>
                            )}
                            <div className='col-6'>
                                {/* <h2>Image</h2> */}
                                <img src={imageURL} alt={adText} height="150px" loading='lazy'/>
                            </div>
                            {errors && (
                                    <h2>
                                       {errors}
                                    </h2>
                            )}
                            <div className='col-6 d-flex justify-content-center align-items-center'>
                                {/* <h2>Ad Text</h2> */}
                                {adText && (

                                    <p>
                                        The Price of {adText} is {price}.
                                    </p>
                                )}

                                {adText && (

                                    <button type="button" className="btn"
                                        onClick={() => speak({
                                            text: adText, voice, rate: 1, pitch: 1.2,
                                        })}>
                                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/500px-Speaker_Icon.svg.png' alt='img' width="20px" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            {/* <select
                                id="voice"
                                name="voice"
                                value={voiceIndex || ''}
                                onChange={(event) => {
                                    setVoiceIndex(event.target.value);
                                }}
                            >   
                                <option value="">Default</option>
                                {voices.map((option, index) => (
                                    <option key={option.voiceURI} value={index}>
                                        {`${option.voiceURI} ${index} `}
                                    </option>
                                ))}
                            </select> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
