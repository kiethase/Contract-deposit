import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const PoolsPage = (props) => {
  const { height, width } = getWindowDimensions();

  return (
    <Container>
      <Card
        sx={{ maxWidth: width / 2 }}
        component={Paper}
        sx={{
          elevation: "5",
          color: "#000000",
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="medium"
            fullWidth
            sx={{
              color: "#FFFFFF",
              backgroundColor: "#217ECA",
              color: "#fff",
              "&:hover": {
          
                backgroundColor: "#216FAF",
              },
            }}
          >
            Share
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default PoolsPage;
