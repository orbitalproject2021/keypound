import React from "react";

function DashboardPieLegend({ children, color }) {
    const COLORS = ["--ac-red", "--ac-green", "--em2"].map((id) =>
        getComputedStyle(document.documentElement).getPropertyValue(id)
    );
    return (
        <div style={styles.itemContainer}>
            <div
                style={{
                    ...styles.colorBlock,
                    backgroundColor: COLORS[color],
                }}
            ></div>
            <p style={{ margin: 3 }}>{children}</p>
        </div>
    );
}

const styles = {
    itemContainer: {
        height: "50px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    colorBlock: {
        width: "25px",
        height: "25px",
        margin: "10px",
        marginTop: "8px",
    },
};

export default DashboardPieLegend;
