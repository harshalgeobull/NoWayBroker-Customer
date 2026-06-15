import React, { useEffect, useState } from "react";
import { withRouter, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const UpcomingProject = (props) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const history = useHistory();
  const upcomingProjectCount = sessionStorage.getItem("upcoming_project_count");

  useEffect(() => {
    const accessToken = sessionStorage.getItem("AccessToken");
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      props.history.push("/login");
      return;
    }

    try {
      const userId = accessToken;
      console.log("Retrieved User ID:", userId);
      fetchProjects(userId);
    } catch (error) {
      console.error("Failed to decode token:", error);
      setError(true);
      setLoading(false);
    }
  }, [props.history]);

  const fetchProjects = (userId) => {
    const accessToken = sessionStorage.getItem("AccessToken");
    const formData = new FormData();
    formData.append("user_id", userId);

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/cust_api/get_upcoming_project`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((response) => {
        if (response.data.status === 1) {
          setProjects(response.data.data);
        } else {
          console.warn("No projects found for this user.");
          setProjects([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching upcoming projects:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (projectId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!isConfirmed) return;

    const accessToken = sessionStorage.getItem("AccessToken");
    const userId = accessToken;

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("upcoming_project_auto_id", projectId);

    axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/cust_api/delete_upcoming_project`,
      data: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        if (response.data.status === 1) {
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project._id !== projectId),
          );
        } else {
          console.error("Error deleting project:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error deleting project:", err);
      });
  };

  if (loading) return <p>Loading upcoming projects...</p>;
  if (error) return <p>Failed to load data.</p>;

  return (
    <div className="min-h-screen flex flex-col justify-between w-full p-5 bg-gray-100">
      {upcomingProjectCount === "0" ? (
        <div className="text-center text-gray-700 my-10">
          <p className="text-lg">To post an offer, please upgrade your plan.</p>
          <p className="text-sm mb-4">
            Plan Purchase is required to proceed with Upcoming Project Posting.
          </p>
          <Link to="/plan">
            <button className="my-bg text-white px-4 py-2 rounded-md hover:my-bg transition duration-300">
              Upgrade Plans
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-5">
            <h2 className="flex-grow text-center text-3xl font-bold text-gray-800">
              Upcoming Projects
            </h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
              onClick={() => props.history.push("/add-upcoming-project")}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Project
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-5 flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 ">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="relative w-[calc(100%-20px)] bg-white border border-gray-300 rounded-lg shadow-md p-2 max-h-[450px] overflow-hidden"
                  >
                    <button
                      className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(project._id)}
                      title="Delete Project"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <img
                      src={`${process.env.REACT_APP_API_URL}${project.project_image}`}
                      alt={`${project.project_name}`}
                      className="w-full h-[280px] object-cover rounded-lg"
                    />
                    <h3 className="text-lg font-semibold">
                      {project.project_name}
                    </h3>
                    <p className="text-sm line-clamp-2">
                      <strong>Description:</strong> {project.description}
                    </p>
                  </div>
                ))
              ) : (
                <p>No upcoming projects available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default withRouter(UpcomingProject);
