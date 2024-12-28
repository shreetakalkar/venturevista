export default function FeatureBottom({ oldPrice, newPrice }) {
    let oldStyle = {
      textDecorationLine: "line-through",
      marginRight: "10px",
      fontSize: "14px",
    };
  
    let newStyle = {
      fontWeight: "bold",
      fontSize: "18px",
    };
  
    let styles = {
      backgroundColor: "#e0c367",
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      height: "50px",
      borderBottomLeftRadius: "15px",
      borderBottomRightRadius: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
    };
  
    return (
      <div style={styles}>
        <span style={oldStyle}>{oldPrice}</span>
        <span style={newStyle}>{newPrice}</span>
      </div>
    );
  }
  