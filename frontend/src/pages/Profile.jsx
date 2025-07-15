import React, { useEffect } from "react";
import MyOrdersPage from "./MyOrdersPage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen mt-6 mb-6 bg-gray-50">
      <div className="max-w-8xl  p-6 mx-auto flex flex-col md:flex-row gap-6 items-start">
        {/* Left Panel: Only content height */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
          <p className="text-gray-600 mb-4">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Right Panel: Full screen height, scrollable */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-50 shadow-md rounded-lg p-4 h-screen overflow-y-auto">
          <MyOrdersPage />
        </div>
      </div>
    </div>
  );
}

export default Profile;
