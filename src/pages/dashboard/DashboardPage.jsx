import {
  ArrowForward,
  Assessment,
  Business,
  People,
  TrendingUp,
  WavingHand,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EtlStatusCard from "../../components/common/EtlStatusCard";
import useAuth from "../../hooks/useAuth";
import useEtlLogs from "../../hooks/useEtlLogs";
import { ROLES, ROUTES } from "../../utils/constants";
import { formatDateTime } from "../../utils/formatters";

// ─── Styled ────────────────────────────────────────────────────────────────────
const MetricCardRoot = styled(Card)(({ theme }) => ({
  height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: theme.shadows[5],
  },
}));

// ─── Tarjeta de métrica ────────────────────────────────────────────────────────
const MetricCard = ({
  title,
  value,
  subtitle,
  Icon,
  colorKey,
  loading,
  onClick,
}) => (
  <MetricCardRoot onClick={onClick}>
    <CardContent>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            mb={1}
          >
            {title}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={64} height={44} />
          ) : (
            <Typography
              variant="h3"
              fontWeight={800}
              color="text.primary"
              lineHeight={1}
            >
              {value ?? "—"}
            </Typography>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            mt={0.5}
            display="block"
          >
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2.5,
            backgroundColor: (t) => alpha(t.palette[colorKey].main, 0.12),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color: `${colorKey}.main`, fontSize: 24 }} />
        </Box>
      </Stack>

      {/* Indicador de tendencia placeholder */}
      <Stack direction="row" alignItems="center" gap={0.5} mt={2}>
        <TrendingUp sx={{ fontSize: 14, color: "success.main" }} />
        <Typography variant="caption" color="success.main" fontWeight={600}>
          Activo
        </Typography>
      </Stack>
    </CardContent>
  </MetricCardRoot>
);

// ─── Tarjeta de bienvenida ─────────────────────────────────────────────────────
const WelcomeCard = ({ user, role }) => {
  const displayName =
    user?.full_name || user?.nombre || user?.username || "Usuario";

  const roleMessages = {
    [ROLES.ADMIN]: "Tienes acceso completo al sistema.",
    [ROLES.COORDINADOR]: "Gestiona tus supervisores y sus razones sociales.",
    [ROLES.SUPERVISOR]: "Gestiona tus usuarios y sus razones sociales.",
    [ROLES.USUARIO]: "Consulta las razones sociales asignadas.",
    [ROLES.RAZON_SOCIAL]: "Consulta tus reportes SOT disponibles.",
  };

  const roleColors = {
    [ROLES.ADMIN]: "#1a77dd",
    [ROLES.COORDINADOR]: "#0f57ae",
    [ROLES.SUPERVISOR]: "#032872",
    [ROLES.USUARIO]: "#2e7d32",
    [ROLES.RAZON_SOCIAL]: "#e65100",
  };

  const gradientColor = roleColors[role] || "#1a77dd";

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${gradientColor} 0%, ${gradientColor}cc 100%)`,
        color: "white",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Círculos decorativos */}
      {[
        { size: 220, top: -60, right: -60, opacity: 0.08 },
        { size: 120, top: 40, right: 80, opacity: 0.06 },
        { size: 80, bottom: -20, left: 40, opacity: 0.06 },
      ].map((circle, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: circle.size,
            height: circle.size,
            borderRadius: "50%",
            backgroundColor: `rgba(255,255,255,${circle.opacity})`,
            top: circle.top,
            right: circle.right,
            bottom: circle.bottom,
            left: circle.left,
          }}
        />
      ))}

      <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
              <WavingHand sx={{ fontSize: 22 }} />
              <Typography variant="h5" fontWeight={700}>
                ¡Hola, {displayName}!
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.85 }} mb={1.5}>
              {roleMessages[role] || "Bienvenido al sistema."}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {formatDateTime(new Date())}
            </Typography>
          </Box>

          <Chip
            label={role?.charAt(0).toUpperCase() + role?.slice(1)}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

// ─── Config de métricas por rol ────────────────────────────────────────────────
const getMetrics = (role) =>
  [
    {
      key: "usuarios",
      title: "Usuarios",
      subtitle: "Total registrado",
      Icon: People,
      colorKey: "primary",
      route: ROUTES.USUARIOS,
      roles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
    },
    {
      key: "razones",
      title: "Razones Sociales",
      subtitle: "Total registrado",
      Icon: Business,
      colorKey: "warning",
      route: ROUTES.RAZON_SOCIAL,
      roles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
    },
    {
      key: "reportes",
      title: "SOT Reportes",
      subtitle: "Total disponible",
      Icon: Assessment,
      colorKey: "success",
      route: ROUTES.REPORTES,
      roles: [
        ROLES.ADMIN,
        ROLES.COORDINADOR,
        ROLES.SUPERVISOR,
        ROLES.USUARIO,
        ROLES.RAZON_SOCIAL,
      ],
    },
  ].filter((m) => m.roles.includes(role));

// ─── Accesos rápidos ───────────────────────────────────────────────────────────
const getQuickAccess = (role) =>
  [
    {
      label: "Ver reportes SOT",
      route: ROUTES.REPORTES,
      color: "primary",
      roles: [
        ROLES.ADMIN,
        ROLES.COORDINADOR,
        ROLES.SUPERVISOR,
        ROLES.USUARIO,
        ROLES.RAZON_SOCIAL,
      ],
    },
    {
      label: "Gestionar usuarios",
      route: ROUTES.USUARIOS,
      color: "inherit",
      roles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
    },
    {
      label: "Razones Sociales",
      route: ROUTES.RAZON_SOCIAL,
      color: "inherit",
      roles: [ROLES.ADMIN, ROLES.COORDINADOR, ROLES.SUPERVISOR],
    },
    {
      label: "Ver jerarquía",
      route: ROUTES.JERARQUIA,
      color: "inherit",
      roles: [ROLES.ADMIN, ROLES.COORDINADOR],
    },
  ].filter((a) => a.roles.includes(role));

// ─── Página ────────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user, role, isRazonSocial } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const { ultimaCarga, loading: etlLoading } = useEtlLogs();

  const metrics = getMetrics(role);
  const quickAccess = getQuickAccess(role);

  useEffect(() => {
    // Placeholder — conectaremos con APIs reales cuando estén los módulos
    const timer = setTimeout(() => {
      setCounts({ usuarios: null, razones: null, reportes: null });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [role]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* ── Bienvenida ────────────────────────────────────────────── */}
        <Grid item xs={12}>
          <WelcomeCard user={user} role={role} />
        </Grid>

        {/* ── Métricas ─────────────────────────────────────────────── */}
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.key}>
            <MetricCard
              title={metric.title}
              value={counts[metric.key]}
              subtitle={metric.subtitle}
              Icon={metric.Icon}
              colorKey={metric.colorKey}
              loading={loading}
              onClick={() => navigate(metric.route)}
            />
          </Grid>
        ))}

        {/* ── Accesos rápidos ───────────────────────────────────────── */}
        {quickAccess.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Accesos rápidos
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {quickAccess.map((item) => (
                    <Button
                      key={item.route}
                      variant={
                        item.color === "primary" ? "contained" : "outlined"
                      }
                      color={item.color === "primary" ? "primary" : "inherit"}
                      endIcon={<ArrowForward fontSize="small" />}
                      onClick={() => navigate(item.route)}
                      sx={{ fontWeight: 500 }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ── Widget ETL — solo usuarios internos ─────────────────────────── */}
        {!isRazonSocial && (
          <Grid item xs={12} md={6}>
            <EtlStatusCard ultimaCarga={ultimaCarga} loading={etlLoading} />
          </Grid>
        )}

        {/* ── Actividad reciente (placeholder) ─────────────────────── */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Actividad reciente
                </Typography>
                <Chip label="Próximamente" size="small" variant="outlined" />
              </Stack>

              {loading ? (
                <Stack gap={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={36} />
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    backgroundColor: "background.subtle",
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Assessment
                    sx={{ fontSize: 36, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    El historial de actividad estará disponible próximamente.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
