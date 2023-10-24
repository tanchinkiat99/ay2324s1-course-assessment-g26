// ... (other imports and code)

return (
    <div className="flex flex-col items-center w-full h-screen p-8">
        <h1 className="text-4xl mb-6">Profile</h1>
        <div className="flex flex-col items-center w-1/2">
            <img
                className="rounded-full w-40 h-40 mb-4"
                src={session?.user.image}
                alt="Profile"
            />
            {editMode ? (
                <>
                    <input
                        className="search_input mb-4"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        className="search_input mb-4"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <button className="black_btn mb-4" onClick={handleSubmit}>
                        Save
                    </button>
                </>
            ) : (
                <>
                    <p className="text-xl mb-4">{`Name: ${session?.user.name}`}</p>
                    <p className="text-xl mb-4">{`Email: ${session?.user.email}`}</p>
                </>
            )}
            <button
                className={editMode ? "outline_btn" : "black_btn"}
                onClick={() => setEditMode(!editMode)}
            >
                {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
        </div>
    </div>
);

// ... (other code)

