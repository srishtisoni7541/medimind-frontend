import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Search, Stethoscope } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { searchHospitals, clearHosError, clearHospitals } from '../store/actions/hospitalaction'
import { searchDoctors, clearDoctors } from '../store/actions/doctoraction'
import { FaStethoscope } from "react-icons/fa";

const FinHome = () => {
    const { enqueueSnackbar } = useSnackbar();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { hospitals, error } = useSelector((state) => state.Hospital);
    const { doctors } = useSelector((state) => state.Doctor);
    const doctorError = useSelector((state) => state.Doctor.error);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showResults, setShowResults] = useState(false);
    const [showDocResults, setShowDocResults] = useState(false);
    const [isDoctorSearch, setIsDoctorSearch] = useState(false);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setResults([]);
            setShowResults(false);
            setShowDocResults(false);
            dispatch(clearHospitals());
            dispatch(clearDoctors());
            return;
        }

        dispatch(clearHospitals());
        dispatch(clearDoctors());

        if (isDoctorSearch) {
            dispatch(searchDoctors({ name: searchTerm }));
        } else {
            dispatch(searchHospitals({ name: searchTerm }));
        }
    }, [searchTerm, isDoctorSearch, dispatch])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearHosError());
        } else if (doctorError) {
            enqueueSnackbar(doctorError, { variant: "error" });
        }
    }, [error, doctorError])

    useEffect(() => {
        if (isDoctorSearch) {
            if (doctors.length > 0) {
                setResults(doctors);
                setShowDocResults(true);
                setShowResults(false);
            } else {
                setResults([]);
                setShowDocResults(false);
                setShowResults(false);
            }
        } else {
            console.log(hospitals,"hai hospiii");
            
            if (hospitals && hospitals.length > 0) {
                setResults(hospitals);
                setShowResults(true);
                setShowDocResults(false);
            } else {
                setResults([]);
                setShowResults(false);
                setShowDocResults(false);
            }
        }
        console.log(isDoctorSearch, "isdc");

    }, [hospitals, doctors, isDoctorSearch]);

    const handleKeyDown = (e) => {
        if (!showResults && !showDocResults) {
            if (e.key === "Enter") {
                if(isDoctorSearch){
                    navigate(`/search?doctorName=${searchTerm}`); 
                }else{
                    navigate(`/search?hospitalName=${searchTerm}`);
                }
            }
            return;
        }
    
        console.log(selectedIndex, "key");
    
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case "Enter":
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    const selectedItem = results[selectedIndex];
                    if (selectedItem && selectedItem._id) {
                        if (isDoctorSearch) {
                            navigate(`/${selectedItem._id}/doctorreview`);
                        } else {
                            navigate(`/${selectedItem._id}/hospitalreview`);
                        }
                        setShowResults(false);
                        setShowDocResults(false);
                    }
                } else {
                    if(isDoctorSearch){
                        navigate(`/search?doctorName=${searchTerm}`); 
                    }else{
                        navigate(`/search?hospitalName=${searchTerm}`);
                    }
                }
                break;
            case "Escape":
                setShowResults(false);
                setShowDocResults(false);
                break;
            default:
                break;
        }
    };
    
    
    
    return (
        <>
            <div className="min-h-screen">
                {/* Navbar */}
                <div className=''>
                <section
                    className="font-montserrat text-customBlack relative flex flex-col items-center bg-white justify-center h-[90vh] text-center bg-cover bg-center px-2"
                    style={{ backgroundImage: `url('./banner.jpg')` }} // Replace with your image URL
                >
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0  bg-black/40 "></div>

                    {/* Content */}
                    <div className=" z-10 text-white">
                        <h1 className="text-4xl font-bold md:text-6xl">DOCTOR HAUS</h1>
                        <p className="mt-4 text-lg md:text-xl">
                            당신의 이야기로 완성되는 당신만의 의료지도
                            {/* Your own medical map completed with your story */}
                        </p>
                        {/* Input Field */}
                        <div className="w-full max-w-md  relative">
                            <div className="relative mt-6">
                                <span className="absolute inset-y-0 left-3 md:left-8 flex items-center text-gray-900 text-2xl w-[22px]">
                                    <FaStethoscope />
                                </span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isDoctorSearch ? "의사 이름을 입력하세요" : "병원 이름을 입력하세요"} /*Enter the hospital name*/
                                    className="w-full px-10 py-3 bg-white text-gray-700 placeholder-gray-400 rounded-lg shadow-lg md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {showResults && results.length > 0 && (
                            <div className='absolute w-full flex items-center justify-center mt-2   max-h-80 overflow-y-auto '>
                                <div className=" md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 ">
                                    {results.slice(0, 5).map((result, index) => (
                                        <Link to={`/${result._id}/hospitalreview`}
                                            key={result._id}
                                            className={`px-4 block  cursor-pointer border-t-2 border-gray-300 py-6  ${index === selectedIndex
                                                ? 'bg-blue-400 text-white'
                                                : 'hover:bg-blue-400'
                                                }`}
                                            onClick={() => {
                                                setSearchTerm(result.name);
                                                setShowResults(false);
                                            }}
                                        >
                                            <div className='flex gap-3'>
                                                <span className='font-bold flex items-center gap-2 text-gray-700'><Building2 /></span>
                                                <span className='my-2  text-gray-700 flex flex-col'> <span className='font-bold text-lg'>{result.name}</span> <span className='text-sm text-gray-600'>{result.address}</span></span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            )}
                           

                            {(showResults || showDocResults) && results.length === 0 && (
                                <div className="absolute w-full mt-2 mx-auto bg-white md:w-96 rounded-lg shadow-lg border border-gray-200">
                                    <div className="px-4 py-3 text-gray-500">
                                        No results found
                                    </div>
                                </div>
                            )}
                            {showDocResults && results.length > 0 && (
                            <div className='absolute w-full flex items-center justify-center mt-2   max-h-80 overflow-y-auto '>
                                <div className="md:w-96 bg-white rounded-lg shadow-lg border border-gray-200">
                                    {results.slice(0, 5).map((result, index) => (
                                        <Link to={`/${result._id}/doctorreview`}
                                            key={result._id}
                                            className={`px-4 block  cursor-pointer border-t-2 border-gray-300 py-6  ${index === selectedIndex
                                                ? 'bg-blue-400 text-white'
                                                : 'hover:bg-blue-400'
                                                }`}
                                            onClick={() => {
                                                setSearchTerm(result.name);
                                                setShowResults(false);
                                            }}
                                        >
                                            <div className='flex gap-3'>
                                                <span className='font-bold flex items-center gap-2 text-gray-700'><Stethoscope /></span>
                                                <span className='my-2  text-gray-700 flex flex-col'> <span className='font-bold text-lg'>{result.name}</span> <span className='text-sm text-gray-600 flex items-center gap-1'><Building2 className='scale-[.8]' /> {result.hospital.name}</span></span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Link */}
                        <p  onClick={() => setIsDoctorSearch((prev) => !prev)}
                            className="block mt-4 text-sm md:text-lg text-blue-300 hover:cursor-pointer underline hover:text-blue-400"
                        >
                            {isDoctorSearch ? "의사 이름으로 검색하기" : "병원 이름으로 검색하기 "}
                            {/* Search by doctor name */}
                        </p>
                    </div>
                </section>
                </div>
               
            </div>
        </>
    )
}

export default FinHome
