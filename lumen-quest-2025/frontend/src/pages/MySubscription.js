import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Modal,
  Badge,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

export default function UserSubscriptionPage() {
  const [plans] = useState([
    {
      id: "basic",
      title: "Basic",
      price: 199,
      quota: "100 GB",
      speed: "50 Mbps",
      perks: ["Email support", "Basic analytics"],
    },
    {
      id: "value",
      title: "Value",
      price: 399,
      quota: "300 GB",
      speed: "150 Mbps",
      perks: ["Priority support", "Free router rental"],
    },
    {
      id: "ultra",
      title: "Ultra",
      price: 699,
      quota: "Unlimited",
      speed: "1 Gbps",
      perks: ["24/7 support", "Smart QoS", "Discounts on add-ons"],
    },
  ]);

  const [currentSub, setCurrentSub] = useState({
    planId: "value",
    subscribedOn: "2025-08-12",
    autoRenew: true,
    expiry: "2025-09-12",
  });

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showOffers, setShowOffers] = useState(false);
  const [notifications] = useState([
    "You have used 70% of your quota.",
    "Your plan will expire on 2025-09-12.",
    "New upgrade available: Ultra Plan.",
  ]);

  // ✅ New state for user
  const [user, setUser] = useState({ name: "", email: "" });

  // ✅ Fetch user data with Axios
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => {
        setUser({
          name: res.data.name,
          email: res.data.email,
        });
      })
      .catch(() => {
        // fallback if API fails
        setUser({
          name: "Anusha Srivastav",
          email: "anushasrivastav18@gmail.com",
        });
      });
  }, []);

  const getPlanById = (id) => plans.find((p) => p.id === id);

  function openConfirm(plan, action) {
    setSelectedPlan(plan);
    setActionType(action);
    setShowConfirm(true);
  }

  function handleConfirm() {
    if (actionType === "subscribe") {
      setCurrentSub({
        planId: selectedPlan.id,
        subscribedOn: new Date().toISOString().slice(0, 10),
        autoRenew: true,
        expiry: "2025-10-12",
      });
    } else if (actionType === "upgrade" || actionType === "downgrade") {
      setCurrentSub((prev) => ({ ...prev, planId: selectedPlan.id }));
    } else if (actionType === "cancel") {
      setCurrentSub(null);
    } else if (actionType === "renew") {
      setCurrentSub((prev) => ({
        ...prev,
        expiry: new Date(
          new Date(prev.expiry).setDate(new Date(prev.expiry).getDate() + 30)
        )
          .toISOString()
          .slice(0, 10),
      }));
    }
    setShowConfirm(false);
    setSelectedPlan(null);
    setActionType("");
  }

  function recommendPlan() {
    const curr = currentSub ? getPlanById(currentSub.planId) : null;
    if (!curr) return plans[1];
    const idx = plans.findIndex((p) => p.id === curr.id);
    return idx < plans.length - 1 ? plans[idx + 1] : plans[idx];
  }

  const recommended = recommendPlan();
  const currentPlan = currentSub ? getPlanById(currentSub.planId) : null;

  return (
    <Container className="py-4">
      {/* Hero Banner with Notification */}
      <Card
        className="mb-4 shadow-sm p-3"
        style={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "#fff",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          {/* Left: Welcome */}
          <div>
            <h4>🎉 Welcome back, {user.name || "Loading..."}!</h4>
            <p>Manage your subscription and explore recommended plans.</p>
          </div>

          {/* Right: Notification Bell */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              style={{ borderRadius: "50%", padding: "0.5rem" }}
            >
              <BellFill color="#6a11cb" size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: "300px" }}>
              <ListGroup>
                <ListGroup.Item>Quota usage reached 80%</ListGroup.Item>
                <ListGroup.Item>Subscription renews in 5 days</ListGroup.Item>
                <ListGroup.Item>
                  New offer available on Ultra plan
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card>

      <Row>
        {/* Left Column */}
        <Col md={8}>
          <h3 className="mb-3">Manage Subscriptions</h3>

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Row>
                <Col xs={12} md={6}>
                  <h5>Your current subscription</h5>
                  {currentSub ? (
                    <div>
                      <h4 className="mt-2">
                        {currentPlan.title}{" "}
                        <Badge bg="secondary">{currentPlan.speed}</Badge>
                      </h4>
                      <div className="text-muted">
                        Subscribed on: {currentSub.subscribedOn}
                      </div>
                      <div className="text-muted">
                        Expiry: {currentSub.expiry}
                      </div>

                      {/* Mock Quota Usage */}
                      <div className="mt-2">
                        <div className="small text-muted">Quota used:</div>
                        <ProgressBar now={70} label="70%" />
                      </div>

                      <div className="mt-3 d-flex gap-2 flex-wrap">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => openConfirm(currentPlan, "renew")}
                        >
                          Renew
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openConfirm(currentPlan, "cancel")}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            const idx = plans.findIndex(
                              (p) => p.id === currentPlan.id
                            );
                            if (idx < plans.length - 1) {
                              openConfirm(plans[idx + 1], "upgrade");
                            }
                          }}
                        >
                          Upgrade
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => {
                            const idx = plans.findIndex(
                              (p) => p.id === currentPlan.id
                            );
                            if (idx > 0) {
                              openConfirm(plans[idx - 1], "downgrade");
                            }
                          }}
                        >
                          Downgrade
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-muted">
                        You do not have an active subscription.
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => setShowOffers(true)}
                      >
                        Browse Plans
                      </Button>
                    </div>
                  )}
                </Col>

                <Col xs={12} md={6} className="border-start ps-4">
                  {/* Quick Recommendations */}
                  <h6>Quick Recommendations</h6>
                  <Card className="p-2 mt-2 shadow-sm">
                    <div>
                      <strong>{recommended.title}</strong> • {recommended.quota}{" "}
                      • {recommended.speed}
                    </div>
                    <div className="mt-2">
                      Why this? Based on recent usage patterns (mock), this plan
                      better matches heavy streaming & gaming needs.
                    </div>
                    <div className="mt-2 d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() =>
                          openConfirm(
                            recommended,
                            currentSub
                              ? currentPlan.price < recommended.price
                                ? "upgrade"
                                : "downgrade"
                              : "subscribe"
                          )
                        }
                      >
                        Choose
                      </Button>
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() => setShowOffers(true)}
                      >
                        See all plans
                      </Button>
                    </div>
                  </Card>

                  {/* Active Offers */}
                  <h6 className="mt-3">Active Offers</h6>
                  <ListGroup className="mt-2">
                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                      <div>
                        <div>
                          <strong>Router Free for 3 months</strong>
                        </div>
                        <div className="small text-muted">
                          On Value and Ultra plans
                        </div>
                      </div>
                      <Badge bg="success">Save ₹500</Badge>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between align-items-start">
                      <div>
                        <div>
                          <strong>10% off on annual prepay</strong>
                        </div>
                        <div className="small text-muted">
                          Apply at checkout
                        </div>
                      </div>
                      <Badge bg="info">Limited</Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column */}
        <Col md={4} className="d-none d-md-block">
          <h5 className="mb-3">Account Summary</h5>
          <Card className="mb-3 shadow-sm p-3">
            <div className="small text-muted">Name</div>
            <div className="mb-2">{user.name || "Loading..."}</div>
            <div className="small text-muted">Email</div>
            <div className="mb-2">{user.email || "Loading..."}</div>
            <hr />
            <div className="small text-muted">Billing</div>
            <div className="mb-2">
              Auto-renew:{" "}
              {currentSub ? (currentSub.autoRenew ? "On" : "Off") : "-"}
            </div>
            <div className="small text-muted">Last payment</div>
            <div className="mb-2">₹{currentSub ? currentPlan.price : "-"}</div>
          </Card>

          <Card className="shadow-sm p-3">
            <h6>Tips to save</h6>
            <ul className="small">
              <li>Prepay annually to save 10%.</li>
              <li>Use off-peak hours for large downloads.</li>
              <li>Monitor quota usage from dashboard.</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Subscription Logs */}
      <Card className="mt-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Subscription Logs</h5>
          <ListGroup>
            {[
              { date: "2025-07-12", action: "Subscribed to Basic Plan" },
              { date: "2025-08-12", action: "Upgraded to Value Plan" },
              { date: "2025-09-01", action: "Renewed Value Plan" },
            ].map((log, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between"
              >
                <div>{log.action}</div>
                <div className="text-muted">{log.date}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Confirm Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm {actionType ? actionType.toUpperCase() : "Action"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div>
              <p>
                Are you sure you want to <strong>{actionType}</strong> to{" "}
                <strong>{selectedPlan.title}</strong> plan (₹
                {selectedPlan.price}/month)?
              </p>
              {actionType === "cancel" && (
                <p className="text-danger">
                  This will cancel your subscription and you will lose access at
                  the end of billing cycle.
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Offers Modal */}
      <Modal show={showOffers} onHide={() => setShowOffers(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Plans & Offers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>All plans will be shown here when needed.</p>
        </Modal.Body>
      </Modal>

      {/* Footer inside Subscription Page */}
      <footer className="mt-4 py-3 bg-light text-center border-top">
        <small className="text-muted">
          © {new Date().getFullYear()} Subscription Management. All rights
          reserved. |{" "}
          <a href="#privacy" className="text-decoration-none">
            Privacy Policy
          </a>
          |{" "}
          <a href="#terms" className="text-decoration-none">
            Terms of Service
          </a>
        </small>
      </footer>
    </Container>
  );
}
