import React, { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_URL;

export default function Contact({ listening }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    console.log("The data that hold listening is", listening.useRef);
    console.log("Listening object:", listening);

    const fetchingData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/test/${listening.useRef}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.log("Fetched landlord data:", data);
        setLandLord(data);
      } catch (error) {
        console.log("Error fetching landlord data:", error);
      }
    };

   
      fetchingData();
    
  }, [listening.useRef]);

  return (
    <>
      {landlord && (
        <div className="mt-4">
          <p>
            Contact <span className="font-bold uppercase">{landlord.username}</span> for new Listening Update
          </p>
          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here......"
            className="border w-full p-3 rounded-lg mt-4"
          ></textarea>

          <a
            href={`mailto:${landlord.email}?subject=Regarding ${listening.name}&body=${message}`}
            className="text-blue-600 underline inline-block mt-3"
          >
            Send Message
          </a>
        </div>
      )}
    </>
  );
}
