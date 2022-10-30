import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      height: '100vh',
    },
  })
);

const TableLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Box component="span" my={8} pt={8}>
        <CircularProgress disableShrink />
      </Box>
    </div>
  );
};

export default TableLoading;
