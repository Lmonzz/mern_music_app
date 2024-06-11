import React, { useEffect, useState } from 'react'
import { Header } from './index';
import { actionType } from '../context/reducer';
import { useStateValue } from '../context/StateProvider';
import { motion } from 'framer-motion';
import { getAllSongs } from '../api';
import { AiOutlineClear } from 'react-icons/ai';

const Home = () => {
  const [{ allSongs, isSongPlaying }, dispatch] = useStateValue();
  const [isFocus, setisFocus] = useState(false);
  const [songFilter, setSongFilter] = useState("");
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then(data => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        })
      })
    }
  }, [])

  return <div className="w-full h-auto flex flex-col items-center justify-center bg-headingColor2">
    <Header />
    <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4 ">
      <div className='w-full flex justify-center items-center gap-20 py-10'>

        <input
          className={`w-52 px-4 py-2 border 
        ${isFocus ? "border-gray-500 shadow-md" : "border-gray-300"} rounded-md bg-transparent outline-none duration-150 transition-all 
        ease-in-out text-base text-textColor font-semibold`}
          type="text" placeholder='Search Here...' value={songFilter} onChange={(e) => setSongFilter(e.target.value)}
          onBlur={() => { setisFocus(false); }}
          onFocus={() => setisFocus(true)}
        />

        <i>
          <AiOutlineClear className='text-3xl text-textColor cursor-pointer' />
        </i>

      </div>
      <HomeSongContainer musics={allSongs} />
    </div>
  </div>
}
export const HomeSongContainer = ({ musics }) => {
  const [{ isSongPlaying, songIndex }, dispatch] = useStateValue();

  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };
  return (
    <>
      {musics?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-zinc-950 shadow-md rounded-lg flex flex-col items-center"
          onClick={() => addSongToContext(index)}
        >
          <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.imageURL}
              alt=""
              className=" w-full h-full rounded-lg object-cover"
            />
          </div>

          <p className="text-base text-headingColor font-semibold my-2">
            {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
            <span className="block text-sm text-gray-400 my-1">
              {data.artist}
            </span>
          </p>
        </motion.div>
      ))}
    </>
  );
};



export default Home