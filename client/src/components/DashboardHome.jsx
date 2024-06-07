import React, { useEffect } from 'react'
import { useStateValue } from '../context/StateProvider'
import { getAllAlbums, getAllArtists, getAllSongs, getAllUsers } from '../api'
import { actionType } from "../context/reducer";
import { GiLoveSong, GiMusicalNotes } from "react-icons/gi";
import { RiUserStarFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa"; 
import { bgColors } from '../utils/style';


export const DashboardCard = ({icon, name, count}) => {

  const bg_Color = bgColors[parseInt(Math.random() * bgColors.length)]

  return (
    <div
      style={{ background: `${bg_Color}` }}
      className={`p-4 w-40 gap-3 h-auto rounded-lg shadow-md flex flex-col items-center justify-center`}
    >
      {icon}
      <p className="text-xl text-textColor2 font-semibold">{name}</p>
      <p className="text-sm text-textColor2">{count}</p>
    </div>
  );
};

const DashboardHome = () => {
  //customstate
  //xai effect hook de fetch thong tin can thiet tung cai
  const [{ allUsers, allSongs, allArtists, allAlbums}, dispatch] = useStateValue();

  useEffect(() => {
    if(!allUsers){
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data.data,
        });
      });
    }
    if(!allArtists){
      getAllArtists().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data.data,
        });
      });
    }
    if(!allAlbums){
      getAllAlbums().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data.data,
        });
      });
    }
    if(!allSongs){
      getAllSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      });
    }
    
  }, [])
  return (
    <div className='w-full p-6 flex items-center justify-evenly'>
      <DashboardCard icon={<FaUsers className="text-3xl text-textColor2" />} name={"Users"} count={allUsers?.length > 0 ? allUsers?.length : 0} />
      <DashboardCard icon={<GiLoveSong className="text-3xl text-textColor2" />} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length : 0} />
      <DashboardCard icon={<RiUserStarFill className="text-3xl text-textColor2" />} name={"Artists"} count={allArtists?.length > 0 ? allArtists?.length : 0} />
      <DashboardCard icon={<GiMusicalNotes className="text-3xl text-textColor2" />} name={"Albums"} count={allAlbums?.length > 0 ? allAlbums?.length : 0} />
    </div>
  )
}

export default DashboardHome