import { Card } from "react-bootstrap";
import { Link } from "react-router";


const ProductCard = (data)=>{
    //destructure every field
    const {name,image,brand,category,description,price} = data;
    
  
    return(
          <Card className="shadow" style={{maxWidth:"400px"} }>
            {/* the image is coming from the server as base64 */}
            <Card.Img variant="top" src={`data:image/png;base64,${image}`}/>
            <Card.Body className="rounded-bottom" style={{backgroundColor:"rgb(143,143,143)"}}>
                <Card.Title className=" text-truncate">{name}</Card.Title>
                <Card.Subtitle >
                    <Link className="text-light" to={`/products?q=${category.name.toLowerCase()}`}>{category.name}</Link>
                    {/* to add white space */}
                    {" "}by{" "}
                    <Link className="text-light" to={`/products?q=${brand.toLowerCase()}`}>{brand}</Link>
  
                </Card.Subtitle>
                <Card.Text className="text-truncate" style={{color:"#000"}}>
                    {description}
                </Card.Text>
                    <small className="text-muted">
                        {price}
                    </small>
            </Card.Body>
        </Card>  
    )
  }

  export default ProductCard;