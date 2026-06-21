import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../services/userService";

export default function Profile() {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {

        const res =
          await getProfile();

        setFormData({
          name:
            res.data.user.name || "",
          email:
            res.data.user.email || "",
          phone:
            res.data.user.phone || "",
          address:
            res.data.user.address || "",
        });

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        const res =
          await updateProfile({
            name:
              formData.name,
            phone:
              formData.phone,
            address:
              formData.address,
          });

        alert(
          res.data.message
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to update profile"
        );

      } finally {

        setSaving(false);

      }

    };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={
                handleChange
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={
                handleChange
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              rows="4"
              name="address"
              value={
                formData.address
              }
              onChange={
                handleChange
              }
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>

      </div>

    </div>
  );
}