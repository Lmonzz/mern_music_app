import React, { useEffect, useRef, useState } from "react";
import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { storage } from "../config/firebase.config";
import { useStateValue } from "../context/StateProvider";
import {
    getAllAlbums,
    getAllArtists,
    getAllSongs,
    saveNewAlbum,
    saveNewArtist,
    saveNewSong,
} from "../api";
import { actionType } from "../context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
import FilterButtons from "./FilterButtons";
// import AlertSuccess from "./AlertSuccess";
// import AlertError from "./AlertError";

const DashboardNewSong = () => {



    const [songName, setSongName] = useState("");
    const [imageUploadProgress, setimageUploadProgress] = useState(0)
    const [songImageCover, setsongImageCover] = useState(null)
    const [isImageLoading, setisImageLoading] = useState(false);

    const [audioImageCover, setaudioImageCover] = useState(null)
    const [audioUploadingProgess, setaudioUploadingProgess] = useState(0)
    const [isAudioLoading, setisAudioLoading] = useState(false)

    const [artistImageCover, setartistImageCover] = useState(null);
    const [artistUploadingProgress, setartistUploadingProgress] = useState(0)
    const [isArtistUploading, setisArtistUploading] = useState(false);
    const [artistName, setartistName] = useState("");
    const [twitter, settwitter] = useState("");
    const [instagram, setinstagram] = useState("");

    const [albumName, setalbumName] = useState("");
    const [albumImageCover, setalbumImageCover] = useState(null);
    const [albumUploadingProgess, setalbumUploadingProgess] = useState(0);
    const [isAlbumUploading, setisAlbumUploading] = useState(false);


    const [{ allArtists, allAlbums, artistFilter, albumFilter, filterTerm, languageFilter, alertType, allSongs }, dispatch] = useStateValue();

    useEffect(() => {
        if (!allArtists) {
            getAllArtists().then(data => {
                dispatch({
                    type: actionType.SET_ALL_ARTISTS,
                    allArtists: data.data,
                })
            })
        }

        if (!allAlbums) {
            getAllAlbums().then(data => {
                dispatch({
                    type: actionType.SET_ALL_ALBUMS,
                    allAlbums: data.data,
                })
            })
        }
    }, [])

    const deleteFileObject = (url, isImage) => {
        if (isImage) {
            setisImageLoading(true);
            setisAudioLoading(true);
            setisAlbumUploading(true);
            setisArtistUploading(true);
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success",
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);
        }

        const deleteRef = ref(storage, url);
        deleteObject(deleteRef).then(() => {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "danger"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);
            setsongImageCover(null);
            setaudioImageCover(null);
            setalbumImageCover(null);
            setartistImageCover(null);
            setisImageLoading(false);
            setisAudioLoading(false);
            setisAlbumUploading(false);
            setisArtistUploading(false);
        })

    }

    const saveSong = () => {
        if (!songImageCover || !audioImageCover) {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "danger"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);

        } else {
            setisAudioLoading(true)
            setisImageLoading(true)

            const data = {
                name: songName,
                imageURL: songImageCover,
                songURL: audioImageCover,
                album: albumFilter,
                artist: artistFilter,
                language: languageFilter,
                category: filterTerm,
            };
            saveNewSong(data).then(res => {
                getAllSongs().then(songs => {
                    dispatch({
                        type: actionType.SET_ALL_SONGS,
                        allSongs: songs.songs,
                    })
                })
            })

            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);

            setSongName("");
            setisAudioLoading(false);
            setisImageLoading(false);
            setsongImageCover(null);
            setaudioImageCover(null);
            dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
            dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
            dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
            dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
        }
    }

    const saveArtist = () => {
        if (!artistImageCover || !artistName || !twitter || !instagram) {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "danger"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);
        } else {
            setisArtistUploading(true);
            const data = {
                name: artistName,
                imageURL: artistImageCover,
                twitter: `www.twitter.com/${twitter}`,
                instagram: `www.instagram.com/${instagram}`,
            }
            saveNewArtist(data).then(res => {
                getAllArtists().then((data) => {
                    dispatch({
                        type: actionType.SET_ALL_ARTISTS,
                        allArtists: data.data,
                    });
                });
            });

            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);

            setisArtistUploading(false);
            setartistImageCover(null);
            setartistName("");
            settwitter("");
            setinstagram("");
        }
    }

    const saveAlbum = () => {
        if (!albumImageCover || !albumName) {
            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "danger"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);
        } else {
            setisAlbumUploading(true);

            const data = {
                name: albumName,
                imageURL: albumImageCover,
            }

            saveNewAlbum(data).then(() => {
                getAllAlbums().then((data) => {
                    dispatch({
                        type: actionType.SET_ALL_ALBUMS,
                        allAlbums: data.data,
                    });
                });
            })

            dispatch({
                type: actionType.SET_ALERT_TYPE,
                alertType: "success"
            })

            setInterval(() => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: null,
                })
            }, 5000);

            setisAlbumUploading(false);
            setalbumImageCover(null);
            setalbumName("");
        }
    }

    return (
        <div className='flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md gap-4'>
            <input type="text" placeholder="Type your song name..."
                className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
            />

            <div className="flex w-full justify-between flex-wrap items-center gap-4">
                <FilterButtons filterData={allArtists} flag={"Artist"} />
                <FilterButtons filterData={allAlbums} flag={"Album"} />
                <FilterButtons filterData={filterByLanguage} flag={"Language"} />
                <FilterButtons filterData={filters} flag={"Category"} />
            </div>
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isImageLoading && <FileLoader progress={imageUploadProgress} />}
                {!isImageLoading && (
                    <>
                        {!songImageCover ? (
                            <FileUpLoader
                                updateState={setsongImageCover}
                                setProgress={setimageUploadProgress}
                                isLoading={setisImageLoading}
                                isImage={true}
                            />
                        ) : (
                            <div className="relative w-full h-full overflow-hidden rounded-md">
                                <img src={songImageCover} className="w-full h-full object-cover" alt="" />
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none 
                                border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(songImageCover, true)}
                                >
                                    <MdDelete className="text-white" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>


            {/* Audio File Uploading */}
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isAudioLoading && <FileLoader progress={audioUploadingProgess} />}
                {!isAudioLoading && (
                    <>
                        {!audioImageCover ? (
                            <FileUpLoader
                                updateState={setaudioImageCover}
                                setProgress={setaudioUploadingProgess}
                                isLoading={setisAudioLoading}
                                isImage={false}
                            />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                                <audio src={audioImageCover} controls></audio>
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none 
                                border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(audioImageCover, false)}
                                >
                                    <MdDelete className="text-white" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Save button */}
            <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isImageLoading || isAudioLoading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className="px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg"
                        onClick={saveSong}
                    >
                        Save song
                    </motion.button>
                )}
            </div>

            {/* Image Uploader for artist */}
            <p className="text-xl font-semibold text-headingColor">Artist Detail</p>
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isArtistUploading && <FileLoader progress={artistUploadingProgress} />}
                {!isArtistUploading && (
                    <>
                        {!artistImageCover ? (
                            <FileUpLoader
                                updateState={setartistImageCover}
                                setProgress={setartistUploadingProgress}
                                isLoading={setisArtistUploading}
                                isImage={true}
                            />
                        ) : (
                            <div className="relative w-full h-full overflow-hidden rounded-md">
                                <img src={artistImageCover} className="w-full h-full object-cover" alt="" />
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none 
                                border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(artistImageCover, true)}
                                >
                                    <MdDelete className="text-white" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* artist name */}
            <input type="text" placeholder="Artist name..."
                className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
                value={artistName}
                onChange={(e) => setartistName(e.target.value)}
            />

            {/* twitter */}
            <div className="flex items-center rounded-md p-3 border border-gray-300 w-full">
                <p className="text-base font-semibold text-gray-400">www.twitter.com/</p>
                <input type="text" placeholder="your twitter id"
                    className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
                    value={twitter}
                    onChange={(e) => settwitter(e.target.value)}
                />
            </div>

            {/* instageam */}
            <div className="flex items-center rounded-md p-3 border border-gray-300 w-full">
                <p className="text-base font-semibold text-gray-400">www.instagram.com/</p>
                <input type="text" placeholder="your instagram id"
                    className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
                    value={instagram}
                    onChange={(e) => setinstagram(e.target.value)}
                />
            </div>

            <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isArtistUploading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className="px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg"
                        onClick={saveArtist}
                    >
                        Save Artist
                    </motion.button>
                )}
            </div>

            {/* Album */}
            <p className="text-xl font-semibold text-headingColor">Album Detail</p>
            <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isAlbumUploading && <FileLoader progress={albumUploadingProgess} />}
                {!isAlbumUploading && (
                    <>
                        {!albumImageCover ? (
                            <FileUpLoader
                                updateState={setalbumImageCover}
                                setProgress={setalbumUploadingProgess}
                                isLoading={setisAlbumUploading}
                                isImage={true}
                            />
                        ) : (
                            <div className="relative w-full h-full overflow-hidden rounded-md">
                                <img src={albumImageCover} className="w-full h-full object-cover" alt="" />
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none 
                                border-none hover:shadow-md duration-200 transition-all ease-in-out"
                                    onClick={() => deleteFileObject(albumImageCover, true)}
                                >
                                    <MdDelete className="text-white" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* Album Name */}
            <input type="text" placeholder="Album name..."
                className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
                value={albumName}
                onChange={(e) => setalbumName(e.target.value)}
            />

            {/* Save Album */}
            <div className="flex items-center justify-center w-60 cursor-pointer p-4">
                {isAlbumUploading ? (
                    <DisabledButton />
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.75 }}
                        className="px-8 py-2 w-full rounded-md text-white bg-red-600 hover:shadow-lg"
                        onClick={saveAlbum}
                    >
                        Save Album
                    </motion.button>
                )}
            </div>
        </div>

    )
}

export const DisabledButton = () => {
    return (
        <button
            disabled
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
            <svg
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                />
            </svg>
            Loading...
        </button>
    );
};

export const FileLoader = ({ progress }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-xl font-semibold text-textColor">
                {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
            </p>
            <div className="w-20 h-20 min-w-[40px] bg-red-600  animate-ping  rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-red-600 blur-xl "></div>
            </div>
        </div>
    )
}

export const FileUpLoader = ({ updateState, setProgress, isLoading, isImage }) => {
    const [{ alertType }, dispatch] = useStateValue();

    const uploadFile = (e) => {
        isLoading(true);
        const uploadedFile = e.target.files[0];
        const storageRef = ref(storage, `${isImage ? "Images" : "Audio"}/${Date.now()}-${uploadedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, uploadedFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            (error) => {
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: "danger"
                })

                setInterval(() => {
                    dispatch({
                        type: actionType.SET_ALERT_TYPE,
                        alertType: null,
                    })
                }, 5000);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateState(downloadURL);
                    isLoading(false);
                })
                dispatch({
                    type: actionType.SET_ALERT_TYPE,
                    alertType: "success"
                })

                setInterval(() => {
                    dispatch({
                        type: actionType.SET_ALERT_TYPE,
                        alertType: null,
                    })
                }, 5000);
            })
    }

    return (
        <label>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col justify-center items-center cursor-pointer text-textColor">
                    <p className="font-bold text-2xl">
                        <BiCloudUpload />
                    </p>
                    <p className="text-lg">
                        Click to upload {isImage ? "an image" : "an audio"}
                    </p>
                </div>
            </div>
            <input type="file"
                name="upload-file"
                accept={`${isImage ? "image/*" : "audio/*"}`}
                className={"w-0 h-0"}
                onChange={uploadFile}
            />
        </label>
    )
}

export default DashboardNewSong