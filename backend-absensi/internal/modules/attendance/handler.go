package attendance

import (
	"backend-absensi/internal/pkg/response"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc       Service
	reportSvc ReportService
}

func NewHandler(svc Service, reportSvc ReportService) *Handler {
	return &Handler{svc, reportSvc}
}

func (h *Handler) CheckIn(c *gin.Context) {
	userID := c.GetString("user_id")
	var req CheckInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	ip := c.ClientIP()
	ua := c.Request.UserAgent()

	res, err := h.svc.CheckIn(userID, req, ip, ua)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusCreated, "Check-in successful", res)
}

func (h *Handler) CheckOut(c *gin.Context) {
	userID := c.GetString("user_id")
	var req CheckOutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusUnprocessableEntity, "Validation error", err.Error())
		return
	}

	ip := c.ClientIP()
	ua := c.Request.UserAgent()

	res, err := h.svc.CheckOut(userID, req, ip, ua)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "Check-out successful", res)
}

func (h *Handler) GetToday(c *gin.Context) {
	userID := c.GetString("user_id")
	res, err := h.svc.GetToday(userID)
	if err != nil {
		response.Error(c, http.StatusNotFound, err.Error(), nil)
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}

func (h *Handler) GetHistory(c *gin.Context) {
	userID := c.GetString("user_id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	res, err := h.svc.GetHistory(userID, page, limit)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to fetch history", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", res)
}

func (h *Handler) GetReport(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	filters := make(map[string]interface{})
	if val := c.Query("employee_id"); val != "" {
		filters["employee_id"] = val
	}
	if val := c.Query("office_id"); val != "" {
		filters["office_id"] = val
	}
	if val := c.Query("status"); val != "" {
		filters["status"] = val
	}
	if val := c.Query("start_date"); val != "" {
		filters["start_date"] = val
	}
	if val := c.Query("end_date"); val != "" {
		filters["end_date"] = val
	}

	res, summary, err := h.reportSvc.GetReport(filters, page, limit)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to generate report", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Success", gin.H{
		"report":  res,
		"summary": summary,
	})
}
