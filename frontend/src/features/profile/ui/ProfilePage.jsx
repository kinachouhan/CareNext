import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-3xl p-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <div className="mt-8">
          <p>
            <b>Name :</b>
            {user.fullName}
          </p>
          <p>
            <b>Email :</b>
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
