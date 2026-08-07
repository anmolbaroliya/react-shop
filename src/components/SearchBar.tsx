import { ChangeEvent, memo } from "react";

interface SearchBarProps {
    value:string;
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void;
}


function SearchBar ({value,onChange}:SearchBarProps){
    console.log("🔍 SearchBar rendered");
    return (
        <input className="search-input"
          type="text"
          placeholder="Search products..."
          value={value}
          onChange={onChange}/>
    )
}

export default memo(SearchBar);

