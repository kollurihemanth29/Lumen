// src/components/LandingPage.js
import React from "react";
import { Container, Row, Col, Card, Carousel, Accordion } from "react-bootstrap";
import axios from "axios";
import slide1 from "../assets/images/slide1.png";
import slide2 from "../assets/images/slide2.png";
import slide3 from "../assets/images/slide3.png";
import FeatureCallTransfer from "../assets/images/FeatureImage_call_transfer.webp";
import data from "../assets/images/360_F_603632141_41XAz3zKUAGw7ESQkcAD9wmyrlpL6Mg0.webp";
import discount from "../assets/images/Recharge-Offers-for-Prepaid-Users-1642674772.webp";
import ai from "../assets/images/exploring-the-influence-of-ai-recommendations-on-user-experience.webp";
import price from "../assets/images/pricing-table-2x.webp";


const LandingPage = () => {
  // Example axios call (future API use)
  React.useEffect(() => {
    axios.get("/api/plans")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  // ✅ Internal CSS styles
  const styles = {
  navbar: {
    padding: "15px 20px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #4a4e69, #22223b)", // gradient navbar
    color: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  },
  hero: {
    background: "linear-gradient(135deg, #4a6fa5, #4a6fa5)",
    color: "white",
    textAlign: "center",
    padding: "80px 20px",
    borderRadius: "12px"
  },
  heroBtn: {
    background: "linear-gradient(to right, #fcd34d, #f59e0b)",
    color: "white",
    padding: "12px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "10px",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  heroBtnHover: {
    transform: "scale(1.05)", // optional hover effect
  },
  sectionHeading: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#004080",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
 
  card: {
    borderRadius: "16px",
    padding: "20px",
    minHeight: "300px", // Increased height for better image display
    maxHeight: "350px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", // Soft cyan/blue pastel
    color: "#1e3a8a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.3s ease",
    overflow: "hidden", // Ensures content doesn't overflow
  },
  cardImage: {
    width: "100%",
    height: "200px", // Fixed height for images
    objectFit: "cover", // Ensures the image covers the area without distortion
    borderRadius: "8px", // Rounded corners for the image
  },
  cardContent: {
    padding: "10px 0",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#333",
  },
  cardHover: {
    transform: "translateY(-5px)",
  },
  faq: {
    marginTop: "50px",
    padding: "0 20px"
  },
  footer: {
    background: "linear-gradient(to right, #4a4e69, #22223b)",
    color: "white",
    padding: "25px 20px",
    marginTop: "50px",
    textAlign: "center",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px"
  },
  footerLinks: {
    color: "white",
    margin: "0 10px",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  footerLinksHover: {
    color: "#00c6ff"
  },
  carouselImg: {
    height: "600px",
    objectFit: "cover",
    borderRadius: "12px",
    width: "100%",
    maxHeight: "90vh",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
  }
};


  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={styles.navbar}>
        <div className="container">
          <a className="navbar-brand" href="/">Subscription Manager</a>
          <div>
            <a className="nav-link d-inline text-light" href="/"> Home  </a>
            <a className="nav-link d-inline text-light" href="/plans"> Plans </a>
            <a className="nav-link d-inline text-light" href="/login"> Login </a>
            <a className="nav-link d-inline text-light" href="/signup"> Sign Up </a>
          </div>
        </div>
      </nav>

     

      {/* Carousel */}
      <Container className="my-5">
        <Carousel fade>
          <Carousel.Item>
            <img className="d-block w-100" src={slide1} alt="slide1" style={styles.carouselImg} />
            <Carousel.Caption style={{ color: "white" }}>
              
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={slide2} alt="slide2" style={styles.carouselImg} />
            <Carousel.Caption style={{ color: "black" }}>
              
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={slide3} alt="slide3" style={styles.carouselImg} />
            <Carousel.Caption style={{ color: "black" }}>
              <h3>Track & Manage Easily</h3>
              <p>Stay updated with recommendations and offers.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>

      {/* Features Section */}
      <Container className="my-5">
  <h2 style={styles.sectionHeading}>Features</h2>

  <Row>
    <Col md={4}>
      <Card style={styles.card}>
   <Card.Img 
  variant="top" 
  src={FeatureCallTransfer} 
  style={styles.cardImage} 
/>


        <Card.Body>
          <Card.Title>Easy Subscription Management</Card.Title>
          <Card.Text>
            Subscribe, upgrade, downgrade, or cancel with one click.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>

    <Col md={4}>
      <Card style={styles.card}>
        <Card.Img 
  variant="top" 
  src={price} 
  style={styles.cardImage} 
/>
        <Card.Body>
          <Card.Title>Plan Catalog & Pricing</Card.Title>
          <Card.Text>
            Browse multiple broadband products with defined quotas and prices.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>

    <Col md={4}>
      <Card style={styles.card}>
        <Card.Img 
  variant="top" 
  src={ai} 
  style={styles.cardImage} 
/>
        <Card.Body>
          <Card.Title>AI Recommendations</Card.Title>
          <Card.Text>
            Get personalized suggestions based on your usage and preferences.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>

  <Row className="mt-3">
    <Col md={6}>
      <Card style={styles.card}>
        <Card.Img 
  variant="top" 
  src={data} 
  style={styles.cardImage} 
/>
        <Card.Body>
          <Card.Title>Analytics & Insights</Card.Title>
          <Card.Text>
            Track top plans, cancellations, and usage patterns.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>

    <Col md={6}>
      <Card style={styles.card}>
        <Card.Img 
  variant="top" 
  src={discount} 
  style={styles.cardImage} 
/>
        <Card.Body>
          <Card.Title>Discounts & Offers</Card.Title>
          <Card.Text>
            Stay updated with discounts and promotional offers.
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>


      {/* FAQ Section */}
      <Container style={styles.faq}>
        <h2 style={styles.sectionHeading}>Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>How do I subscribe to a plan?</Accordion.Header>
            <Accordion.Body>Simply browse plans, pick one, and click Subscribe.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Can I switch plans anytime?</Accordion.Header>
            <Accordion.Body>Yes, you can upgrade or downgrade anytime.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Do I need to pay online here?</Accordion.Header>
            <Accordion.Body>No, payments are simulated for demo purposes.</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Will I get notifications before renewal?</Accordion.Header>
            <Accordion.Body>Yes, you’ll be notified when your plan is about to expire.</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
<br></br>
       {/* Hero Banner */}
      <div style={styles.hero}>
        <h1>Manage Your Subscriptions Easily</h1>
        <p>Subscribe, upgrade, downgrade, or cancel anytime with just one click.</p>
        <a href="/plans" style={styles.heroBtn}>Get Started</a>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Subscription Management System | All Rights Reserved</p>
        <p>
          <a href="/privacy" style={styles.footerLinks}>Privacy Policy</a>
          <a href="/terms" style={styles.footerLinks}>Terms of Service</a>
        </p>
      </footer>
    </>
  );
};

export default LandingPage;
