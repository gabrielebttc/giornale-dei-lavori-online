import MapComponent from "../MapComponent";
import AddRecordComponent from "../AddRecordComponent";

const HomePage = () => {
    return (
      <div>
        <MapComponent />
        <AddRecordComponent tableName="building_sites" onNewRecord={setUpdateList(true)}/>
      </div>
    );
  };
  
  export default HomePage;
  