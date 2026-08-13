const Loader = ({ size = 20, color = "white" }) => {

    return (

        <div
            className="animate-spin rounded-full border-2 border-t-transparent"
            style={{
                width: size,
                height: size,
                borderColor: color,
                borderTopColor: "transparent",
            }}
        />

    );

};

export default Loader;