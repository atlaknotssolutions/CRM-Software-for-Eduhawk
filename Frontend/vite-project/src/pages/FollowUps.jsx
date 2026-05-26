import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Search } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const FollowUps = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [followUps, setFollowUps] = useState([]);
  const [filter, setFilter] = useState("upcoming");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const API_BASE = API_URL;

  useEffect(() => {
    const fetch = async () => {
      if (!token) return;
      setLoading(true);
      try {
        // Dashboard endpoint reliably provides follow-up lists
        const res = await axios.get(`${API_BASE}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || res.data || {};
        const list =
          data.allFollowUps ||
          data.upcomingFollowUps ||
          data.followUpsToday ||
          [];
        setFollowUps(list);
      } catch (err) {
        console.error("Failed to fetch follow-ups", err);
        toast.error("Unable to load follow-ups");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Follow-ups</h2>
          <p className="text-sm text-muted-foreground">
            Manage and view scheduled follow-ups
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/leads/new")}>Add Lead</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <Search className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Follow-up List
          </CardTitle>
          <CardDescription>
            Showing {followUps.length} follow-ups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : followUps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No follow-ups found
              </div>
            ) : (
              followUps.map((f) => (
                <div
                  key={f.id || f._id || JSON.stringify(f)}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">
                      {f.student || f.name || f.title || "—"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {f.country || f.source || "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">
                      <Badge variant="secondary">
                        {f.date || f.followUpDate || "—"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {f.time || "--:--"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUps;
