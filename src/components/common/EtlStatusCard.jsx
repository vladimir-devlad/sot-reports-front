import {
  CheckCircle,
  CloudSync,
  ErrorOutline,
  HourglassEmpty,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatDateTime } from "../../utils/formatters";

const ESTADO_CONFIG = {
  completado: {
    label: "Completado",
    color: "success",
    Icon: CheckCircle,
  },
  en_proceso: {
    label: "En proceso",
    color: "warning",
    Icon: HourglassEmpty,
  },
  error: {
    label: "Error",
    color: "error",
    Icon: ErrorOutline,
  },
};

const EtlStatusCard = ({ ultimaCarga, loading }) => {
  const config = ESTADO_CONFIG[ultimaCarga?.estado] || ESTADO_CONFIG.completado;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo decorativo */}
      <Box
        sx={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "info.lighter",
          opacity: 0.5,
        }}
      />

      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Última actualización de datos
            </Typography>

            {loading ? (
              <>
                <Skeleton width={180} height={32} sx={{ mt: 0.5 }} />
                <Skeleton width={120} height={20} sx={{ mt: 0.5 }} />
              </>
            ) : ultimaCarga ? (
              <>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.primary"
                  mt={0.5}
                >
                  {formatDateTime(
                    ultimaCarga.finalizado_at || ultimaCarga.iniciado_at,
                  )}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={config.label}
                    color={config.color}
                    size="small"
                    icon={<config.Icon sx={{ fontSize: "14px !important" }} />}
                  />
                  {ultimaCarga.total_registros != null && (
                    <Typography variant="caption" color="text.secondary">
                      {ultimaCarga.total_registros.toLocaleString()} registros
                    </Typography>
                  )}
                  {ultimaCarga.registros_nuevos_razon_social != null && (
                    <Tooltip title="Nuevas razones sociales en esta carga">
                      <Typography
                        variant="caption"
                        color="primary.main"
                        fontWeight={600}
                      >
                        +{ultimaCarga.registros_nuevos_razon_social} nuevas RS
                      </Typography>
                    </Tooltip>
                  )}
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.disabled" mt={0.5}>
                Sin información de carga
              </Typography>
            )}
          </Box>

          {/* Ícono */}
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              backgroundColor: "info.lighter",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ml: 1,
            }}
          >
            <CloudSync sx={{ color: "info.main", fontSize: 22 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EtlStatusCard;
