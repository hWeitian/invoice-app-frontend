import React, { useState, useEffect } from "react";
import PageTitle from "../Components/PageTitle";
import { Grid, Typography } from "@mui/material";
import OverviewTable from "../Components/OverviewTable";
import AutocompleteInput from "../Components/AutocompleteInput";
import { getData, calculateOrdersAmount, calculateOutstanding } from "../utils";
import OverviewCard from "../Components/OverviewCard";
import useGetAccessToken from "../Hooks/useGetAccessToken";

const Home = () => {
  const getAccessToken = useGetAccessToken();
  const [orders, setOrders] = useState([]);
  const [magazines, setMagazines] = useState();
  const [selectedMag, setSelectedMag] = useState(null);

  useEffect(() => {
    getStartingData();
  }, []);

  useEffect(() => {
    if (selectedMag) {
      updateTableData(selectedMag.id);
    } else {
      setOrders([]);
    }
  }, [selectedMag]);

  const getStartingData = async () => {
    const accessToken = await getAccessToken();
    const currentIssue = await getData(accessToken, "magazines/current-issue");
    setSelectedMag(currentIssue[0]);
    const promises = [
      getData(accessToken, `orders/magazine/${currentIssue[0].id}`),
      getData(accessToken, "magazines"),
    ];
    const [ordersData, issueData] = await Promise.all(promises);
    setOrders(ordersData);
    setMagazines(issueData);
  };

  const updateTableData = async (id) => {
    const accessToken = await getAccessToken();
    const newOrdersData = await getData(accessToken, `orders/magazine/${id}`);
    setOrders(newOrdersData);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <PageTitle>Overview</PageTitle>
        </Grid>
        <Grid item xs={6}>
          <Grid container sx={{ justifyContent: "flexEnd" }}>
            <Grid item xs={7} sx={{ textAlign: "right", m: "auto", pr: 1 }}>
              <Typography style={{ margin: 0, padding: 0, fontWeight: 700 }}>
                Magazine Issue:
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <AutocompleteInput
                id="magazine-input"
                placeholder="Select an issue"
                options={magazines}
                columnName="year"
                hasTwoColumns={true}
                columnNameTwo="month"
                value={selectedMag}
                onChange={(e) => setSelectedMag(e)}
                error={false}
                width="250px"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        {selectedMag && (
          <Typography
            sx={{ mb: 3, mt: 3, p: 0, fontWeight: 700, fontSize: "1.1rem" }}
          >
            Advertisements for {`${selectedMag.month} ${selectedMag.year}`}{" "}
            Issue
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between">
        <Grid item>
          <OverviewCard title="Advertisements" content={orders.length} />
        </Grid>
        <Grid item>
          <OverviewCard
            title="Total Invoiced"
            content={`${calculateOrdersAmount(
              orders,
              "totalAmount"
            ).toLocaleString("en-US")} USD`}
          />
        </Grid>
        <Grid item>
          <OverviewCard
            title="Outstanding"
            content={`${calculateOutstanding(
              orders,
              "totalAmount"
            ).toLocaleString("en-US")} USD`}
          />
        </Grid>
        <Grid item>
          <OverviewCard
            title="Paid"
            content={`${calculateOrdersAmount(
              orders,
              "amountPaid"
            ).toLocaleString("en-US")} USD`}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{ mt: 5 }}>
          {selectedMag && <OverviewTable magazineIssue={selectedMag.id} />}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
