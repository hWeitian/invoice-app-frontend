import React, { useState, useEffect } from "react";
import PageTitle from "../Components/PageTitle";
import { Grid, Typography } from "@mui/material";
import OverviewTable from "../Components/OverviewTable";
import AutocompleteInput from "../Components/AutocompleteInput";
import MultipleAutocompleteInput from "../Components/MultipleAutocompleteInput";
import { getData, calculateOrdersAmount, calculateOutstanding } from "../utils";
import OverviewCard from "../Components/OverviewCard";
import useGetAccessToken from "../Hooks/useGetAccessToken";
import LoadingScreen from "../Components/LoadingScreen";

const Home = () => {
  const getAccessToken = useGetAccessToken();
  const regions = [
    {
      name: "Asia-Pacific",
      id: 1,
    },
    {
      name: "China",
      id: 2,
    },
    {
      name: "Korea",
      id: 3,
    },
    {
      name: "India",
      id: 4,
    },
  ];
  const [selectedRegions, setSelectedRegions] = useState(regions);
  const [loadingOpen, setLoadingOpen] = useState(true);
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
    setLoadingOpen(false);
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
      {selectedMag ? (
        <>
          <Grid container>
            <Typography
              sx={{ mb: 3, mt: 3, p: 0, fontWeight: 700, fontSize: "1.1rem" }}
            >
              Advertisements for {`${selectedMag.month} ${selectedMag.year}`}{" "}
              Issue
            </Typography>
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
          <Grid container sx={{ mt: 5 }}>
            <Grid item xs={12}>
              <Typography
                sx={{ fontWeight: 600, fontSize: "0.876rem", mb: 0.5 }}
              >
                Selected Regions
              </Typography>
            </Grid>
            <Grid item>
              <MultipleAutocompleteInput
                id="regions"
                placeholder="Select Regions"
                options={regions}
                columnName="name"
                hasTwoColumns={false}
                columnNameTwo=""
                variant="standard"
                value={selectedRegions}
                onChange={(e) => setSelectedRegions(e)}
                width="500px"
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <OverviewTable
                magazineIssue={selectedMag.id}
                selectedRegions={selectedRegions}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "80vh" }}
        >
          <Grid item>
            <Typography
              sx={{ fontWeight: 700, fontSize: "1.2rem" }}
              color="primary"
            >
              Please Select an Issue
            </Typography>
          </Grid>
        </Grid>
      )}
      <LoadingScreen
        open={loadingOpen}
        handleClose={() => setLoadingOpen(false)}
      />
    </>
  );
};

export default Home;
