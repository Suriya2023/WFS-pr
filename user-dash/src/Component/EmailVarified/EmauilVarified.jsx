import { Fragment, useEffect, useState } from "react";
import verifiedimg from "../../assets/Uploads/varified.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmauilVarified = () => {
    const [valideUrl, setValideUrl] = useState(false);
    const params = useParams();
    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL}/api/users/${params.id}/verify/${params.token}`;
                const data = await axios.get(url);
                console.log(data)
                setValideUrl(true);
            } catch (error) {
                console.log(false)
                setValideUrl(false);
            }
        };
        verifyEmailUrl();
    }, [params.id, params.token]);

    return (

        <Fragment>
            {
                valideUrl ? (
                    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden">

                        <div className="hidden md:flex w-full md:w-1/2 bg-[#134b9b] text-white p-10 flex-col justify-center relative">

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Email Verified Successfully
                            </h1>

                            <img src={verifiedimg} alt="" />
                            <p className="text-xl md:text-2xl mt-6 opacity-90">
                                You can now log in to your account.
                            </p>
                        </div>

                        <div className="w-full md:w-1/2 flex items-center justify-center p-10">


                            <div className="max-w-md w-full">
                                <h2 className="text-2xl font-semibold mb-6">Your email has been verified!</h2>
                                <p className="mb-4">You can now log in to your account.</p>
                                <button className="w-full bg-[#134b9b] text-white py-2 px-4 rounded hover:bg-[#0f3a75] transition duration-300">
                                    Go to Login
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1 className="text-3xl font-bold text-center mt-20">404 Not Found</h1>
                )
            }

        </Fragment>
    )
};

export default EmauilVarified;