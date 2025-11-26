import { Dashcards } from "../components/lcard";
import { Bdashcard } from "../components/bcard";
import { Notificationbt } from "../components/notficationh";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AddServiceButton from "../components/add_service_button";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <header>
        <Notificationbt />
        <div className="flex items-center justify-between p-6">
          {" "}
          <div className="">
            <p className="text-4xl font-bold">Dashboard</p>
            <h1 className="text-muted-foreground">Bem-Vindo</h1>
          </div>
          <div>
            <AddServiceButton />
          </div>
        </div>
      </header>

      <div>
        <div>
          <Dashcards />
          <Bdashcard />
        </div>
        <div></div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
