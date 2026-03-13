import MapComponent from "../MapComponent";
import AddRecordComponent from "../AddRecordComponent";
import { useState } from "react";

const HomePage = () => {

    const [reloadBuildingSitesList, setReloadBuildingSitesList] = useState<boolean>(false);

    return (
      <div>
        <MapComponent reloadBuildingSitesList={reloadBuildingSitesList} onReloadCompleted={() => setReloadBuildingSitesList(false)} />
        <AddRecordComponent tableName="building_sites" onSuccess={() => setReloadBuildingSitesList(true)}/>
      </div>
    );
  };
  
  export default HomePage;
  