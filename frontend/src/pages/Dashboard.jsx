import { useEffect, useState } from "react";
import { API } from "../services/api";

export default function Dashboard(){
  const [health, setHealth] = useState(null);

  useEffect(() => {
    API.get("/health").then(r => setHealth(r.data)).catch(()=>setHealth({error:true}));
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
}
