import React, { Component } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';

class AddUpcomingProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project_image: null,
            project_name: '',
            description: '',
            loading: false,
            alert: null,
        };

        // Ref for the file input to reset it after form submission
        this.fileInputRef = React.createRef();
    }

    componentDidMount() {
        const accessToken = sessionStorage.getItem('AccessToken');
        if (!accessToken) {
            this.props.history.push('/login');
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            this.setState({ project_image: file });
        }
    };



    updateProfileAndCount = async (userId) => {
        try {
            const profileResponse = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/get_profile`, {
                user_id: userId,
            });

            const currentCounts = profileResponse.data.count_data;
            const currentUpcomingProjectCount = parseInt(currentCounts.upcoming_project_count, 10) || 0;
            const updatedUpcomingProjectCount = currentUpcomingProjectCount - 1;
            const newUpcomingProjectCount = Math.max(updatedUpcomingProjectCount, 0); // Ensure non-negative count

            const updateCountResponse = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/add_count`, {
                user_id: userId,
                free_view_count: currentCounts.free_view_count,
                free_post_count: currentCounts.free_post_count,
                paid_view_count: currentCounts.paid_view_count,
                paid_post_count: currentCounts.paid_post_count,
                feature_count: currentCounts.feature_count,
                offer_count: currentCounts.offer_count,
                upcoming_project_count: newUpcomingProjectCount,
            });

            if (updateCountResponse.data.status === 1) {
                sessionStorage.setItem('upcoming_project_count', newUpcomingProjectCount);
            } else {
                console.error("Failed to update upcoming project count");
            }
        } catch (error) {
            console.error("Error updating profile and count:", error.message);
        }
    };

    updateProfileAndCount = async (userId) => {
        try {
            const profileResponse = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/get_profile`, {
                user_id: userId,
            });

            const currentCounts = profileResponse.data.count_data;
            const currentUpcomingProjectCount = parseInt(currentCounts.upcoming_project_count, 10) || 0;
            const updatedUpcomingProjectCount = currentUpcomingProjectCount - 1;
            const newUpcomingProjectCount = Math.max(updatedUpcomingProjectCount, 0); // Ensure non-negative count

            const updateCountResponse = await axios.post(`${process.env.REACT_APP_API_URL}/cust_api/add_count`, {
                user_id: userId,
                free_view_count: currentCounts.free_view_count,
                free_post_count: currentCounts.free_post_count,
                paid_view_count: currentCounts.paid_view_count,
                paid_post_count: currentCounts.paid_post_count,
                feature_count: currentCounts.feature_count,
                offer_count: currentCounts.offer_count,
                upcoming_project_count: newUpcomingProjectCount,
            });

            if (updateCountResponse.data.status === 1) {
                sessionStorage.setItem('upcoming_project_count', newUpcomingProjectCount);
            } else {
                console.error("Failed to update upcoming project count");
            }
        } catch (error) {
            console.error("Error updating profile and count:", error.message);
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const accessToken = sessionStorage.getItem('AccessToken');

        if (!accessToken) {
            this.setState({
                alert: { type: 'error', msg: 'Access token not found.' },
            });
            return;
        }

        const user_id = accessToken; // Simulating user ID extraction
        this.setState({ loading: true });

        const { project_image, project_name, description } = this.state;

        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('project_image', project_image);
        formData.append('project_name', project_name);
        formData.append('description', description);

        axios.post(`${process.env.REACT_APP_API_URL}/cust_api/upcoming_project`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                if (response.data.status === 1) {
                    this.setState({
                        alert: { type: 'success', msg: 'Project added successfully!' },
                        project_image: null,
                        project_name: '',
                        description: '',
                        loading: false,
                    });

                    if (this.fileInputRef.current) {
                        this.fileInputRef.current.value = null;
                    }

                    // Call updateProfileAndCount here after successful addition
                    this.updateProfileAndCount(user_id);
                    this.props.history.push('/upcomingproject');

                    setTimeout(() => {
                        this.setState({ alert: null });
                    }, 3000);
                } else {
                    this.setState({
                        alert: { type: 'error', msg: 'Failed to add project.' },
                        loading: false
                    });

                    setTimeout(() => {
                        this.setState({ alert: null });
                    }, 3000);
                }
            })
            .catch(err => {
                console.error('Error adding upcoming project:', err);
                this.setState({
                    alert: { type: 'error', msg: 'Error adding project.' },
                    loading: false
                });

                setTimeout(() => {
                    this.setState({ alert: null });
                }, 3000);
            });
    };

    render() {
        const { project_name, description, loading, alert } = this.state;
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white shadow-lg rounded-lg py-8 px-10 w-3/4">
                    <h2 className="text-xl font-bold mb-4 text-center">Add Upcoming Project</h2>

                    {alert && (
                        <div className={`mb-4 p-4 text-white rounded ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {alert.msg}
                        </div>
                    )}
                    <form onSubmit={this.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Upload Project Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={this.handleImageUpload}
                                ref={this.fileInputRef}
                                required
                                className="border border-gray-300 p-2 w-full rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Project Name:</label>
                            <input
                                type="text"
                                name="project_name"
                                value={project_name}
                                onChange={this.handleChange}
                                required
                                className="border border-gray-300 p-2 w-full rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Description:</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={this.handleChange}
                                required
                                className="border border-gray-300 p-2 w-full rounded"
                            ></textarea>
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                            <button
                                type="submit"
                                className={`w-3/4 bg-blue-500 text-white font-bold py-2 px-4 rounded 
                                    ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-600'} 
                                    transition duration-300 ease-in-out shadow-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-400`}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Project'}
                            </button>
                            <Link to="/upcomingproject" className="w-3/4">
                                <button
                                    className="w-full bg-gray-400 text-white font-bold py-2 px-4 rounded
                                        transition duration-300 ease-in-out shadow-md focus:outline-none"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(AddUpcomingProject);